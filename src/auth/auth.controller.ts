import { Controller, Post, UseGuards, Request, Get, HttpCode, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/guards/local-auth.guard';
import { exceptionHandler } from '../exceptions/exception.handler';
import { StatusCode, userIdField, userNotFound } from '../exceptions/exception.constants';
import { UsersQueryRepository } from '../users/users.query.repository';
import { UserInputDto, confirmationCodeInputDto, emailInputDto, newPasswordInputDto } from '../users/users.types';
import { DevicesService } from '../devices/devices.service';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JwtBearerGuard } from './passport/guards/jwt-bearer.guard';
import { JwtRefreshGuard } from './passport/guards/jwt-refresh.guard';
import { UserFromReq } from './decorators/userId.decorator';
import { DeviceDetais } from './decorators/device.details.decorator';
import { ObjectId } from 'mongodb';
import { DeviceIdFromReq } from './decorators/deviceId.decorator';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersQueryRepository: UsersQueryRepository,
		private readonly devicesService: DevicesService
	) {}

	@Post('registration')
	@HttpCode(204)
	async registerUser(@Body() inputModel: UserInputDto) {
		const result = await this.authService.registerUser(inputModel);
		return result;
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(200)
	async login(@Res({ passthrough: true }) res: Response, @UserFromReq() userId: string, @DeviceDetais() deviceDetais) {
		const deviceId = uuidv4();
		const result = await this.authService.login(userId, deviceId);

		await this.devicesService.createNewSession(
			result.refreshToken,
			deviceDetais.deviceName,
			deviceDetais.ip,
			userId,
			deviceDetais.expDate
		);

		res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true });
		return {
			accessToken: result.accessToken,
		};
	}

	@UseGuards(JwtBearerGuard, JwtRefreshGuard)
	@Get('me')
	@HttpCode(200)
	async getProfile(@UserFromReq() userId: ObjectId) {
		const user = await this.usersQueryRepository.findUserById(userId);

		if (!user) {
			return exceptionHandler(StatusCode.NotFound, userNotFound, userIdField);
		}

		return {
			email: user.email,
			login: user.login,
			userId: userId.toString(),
		};
	}

	@UseGuards(JwtRefreshGuard)
	@Post('refresh-token')
	@HttpCode(200)
	async getRefreshToken(
		@UserFromReq() userId: string,
		@DeviceIdFromReq() deviceId: string,
		@Res({ passthrough: true }) res: Response
	) {
		const result = await this.authService.login(userId, deviceId);
		const lastActiveDate = Math.floor(Date.now() / 1000);
		await this.devicesService.updateLastActiveDate(deviceId, lastActiveDate);
		res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true });
		return {
			accessToken: result.accessToken,
		};
	}

	@UseGuards(JwtRefreshGuard)
	@Post('logout')
	@HttpCode(204)
	async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
		const deviceId = req.user.deviceId;
		await this.devicesService.terminateSession(deviceId);
		res.clearCookie('refreshToken');
		return;
	}

	@Post('registration-confirmation')
	@HttpCode(204)
	async confirmRegistration(@Body() codeInputModel: confirmationCodeInputDto) {
		const result = await this.authService.confirmEmail(codeInputModel.code);
		return result;
	}

	@Post('registration-email-resending')
	@HttpCode(204)
	async resendEmail(@Body() emailInputModel: emailInputDto) {
		const result = await this.authService.resendEmail(emailInputModel.email);
		return result;
	}

	@Post('password-recovery')
	@HttpCode(204)
	async recoverPassword(@Body() inputModel: emailInputDto) {
		const result = await this.authService.sendPasswordRecoveryEmail(inputModel.email);
		return result;
	}

	@Post('new-password')
	@HttpCode(204)
	async updatePassword(@Body() inputModel: newPasswordInputDto) {
		const userIdByCode = await this.authService.confirmRecoveryCode(inputModel.recoveryCode);
		if (userIdByCode) {
			await this.authService.updatePassword(userIdByCode, inputModel.newPassword);
		}
	}
}
