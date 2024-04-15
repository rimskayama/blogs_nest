import { Controller, Post, UseGuards, Request, Get, HttpCode, Body, Res } from '@nestjs/common';
import { LocalAuthGuard } from './passport/guards/local-auth.guard';
import { exceptionHandler } from '../exceptions/exception.handler';
import { StatusCode, userIdField, userNotFound } from '../exceptions/exception.constants';
import { UsersQueryRepository } from '../users/users.query.repository';
import { UserInputDto, confirmationCodeInputDto, emailInputDto, newPasswordInputDto } from '../users/users.types';
import { DevicesService } from '../devices/devices.service';
import { Response } from 'express';
import { JwtBearerGuard } from './passport/guards/jwt-bearer.guard';
import { JwtRefreshGuard } from './passport/guards/jwt-refresh.guard';
import { UserFromReq } from './decorators/userId.decorator';
import { DeviceDetais } from './decorators/device.details.decorator';
import { DeviceIdFromReq } from './decorators/deviceId.decorator';
import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationCommand } from './use-cases/registration/registration.use-case';
import { RegistrationConfirmEmailCommand } from './use-cases/registration/registration-confirm-email.user-case';
import { RegistrationResendEmailCommand } from './use-cases/registration/registration-resend-email.use-case';
import { PasswordRecoveryCommand } from './use-cases/password/password-recovery.use-case';
import { PasswordUpdateCommand } from './use-cases/password/password-update.use-case';
import { LoginUserCommand } from './use-cases/login/login-user.use-case';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
	constructor(
		private commandBus: CommandBus,
		private readonly usersQueryRepository: UsersQueryRepository,
		private readonly devicesService: DevicesService
	) {}

	@UseGuards(ThrottlerGuard)
	@Post('registration')
	@HttpCode(204)
	async registerUser(@Body() inputModel: UserInputDto) {
		const result = await this.commandBus.execute(new RegistrationCommand(inputModel));
		return result;
	}

	@UseGuards(ThrottlerGuard, LocalAuthGuard)
	@Post('login')
	@HttpCode(200)
	async login(@Res({ passthrough: true }) res: Response, @UserFromReq() userId: string, @DeviceDetais() deviceDetais) {
		const deviceId = uuidv4();
		const result = await this.commandBus.execute(new LoginUserCommand(userId, deviceId));

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

	@UseGuards(JwtBearerGuard)
	@Get('me')
	@HttpCode(200)
	async getProfile(@UserFromReq() userId: string) {
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
		const result = await this.commandBus.execute(new LoginUserCommand(userId, deviceId));
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

	@UseGuards(ThrottlerGuard)
	@Post('registration-confirmation')
	@HttpCode(204)
	async confirmRegistration(@Body() codeInputModel: confirmationCodeInputDto) {
		const result = await this.commandBus.execute(new RegistrationConfirmEmailCommand(codeInputModel.code));
		return result;
	}

	@UseGuards(ThrottlerGuard)
	@Post('registration-email-resending')
	@HttpCode(204)
	async resendEmail(@Body() emailInputModel: emailInputDto) {
		const result = await this.commandBus.execute(new RegistrationResendEmailCommand(emailInputModel.email));
		return result;
	}

	@UseGuards(ThrottlerGuard)
	@Post('password-recovery')
	@HttpCode(204)
	async recoverPassword(@Body() inputModel: emailInputDto) {
		const result = await this.commandBus.execute(new PasswordRecoveryCommand(inputModel.email));
		return result;
	}

	@UseGuards(ThrottlerGuard)
	@Post('new-password')
	@HttpCode(204)
	async updatePassword(@Body() inputModel: newPasswordInputDto) {
		return await this.commandBus.execute(new PasswordUpdateCommand(inputModel));
	}
}
