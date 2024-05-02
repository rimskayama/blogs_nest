import { Controller, Post, UseGuards, Get, HttpCode, Body, Res, HttpStatus } from '@nestjs/common';
import { LocalAuthGuard } from './passport/guards/local-auth.guard';
import { UsersQueryRepository } from '../users/users.query.repository';
import {
	UserFromGuard,
	UserInputDto,
	confirmationCodeInputDto,
	emailInputDto,
	newPasswordInputDto,
} from '../users/users.types';
import { Response } from 'express';
import { JwtBearerGuard } from './passport/guards/jwt-bearer.guard';
import { JwtRefreshGuard } from './passport/guards/jwt-refresh.guard';
import { UserFromReq } from './decorators/userId.decorator';
import { DeviceDetails } from './decorators/device.details.decorator';
import { DeviceIdFromReq } from './decorators/deviceId.decorator';
import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationCommand } from './use-cases/registration/registration.use-case';
import { RegistrationConfirmEmailCommand } from './use-cases/registration/registration-confirm-email.user-case';
import { RegistrationResendEmailCommand } from './use-cases/registration/registration-resend-email.use-case';
import { PasswordRecoveryCommand } from './use-cases/password/password-recovery.use-case';
import { PasswordUpdateCommand } from './use-cases/password/password-update.use-case';
import { LoginUserCommand } from './use-cases/login/login-user.use-case';
import { CreateDeviceCommand } from '../devices/use-cases/create-device.use-case';
import { UpdateDeviceCommand } from '../devices/use-cases/update-device-tokens.use-case';
import { DeviceLogoutCommand } from '../devices/use-cases/delete-device-logout.use-case';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
	constructor(
		private commandBus: CommandBus,
		private readonly jwtService: JwtService,
		private readonly usersQueryRepository: UsersQueryRepository
	) {}

	@UseGuards(ThrottlerGuard)
	@Post('registration')
	@HttpCode(HttpStatus.NO_CONTENT)
	async registerUser(@Body() inputModel: UserInputDto) {
		const result = await this.commandBus.execute(new RegistrationCommand(inputModel));
		return result;
	}

	@UseGuards(ThrottlerGuard, LocalAuthGuard)
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Res() res: Response, @UserFromReq() user: UserFromGuard, @DeviceDetails() deviceDetails) {
		const deviceId = uuidv4();
		const result = await this.commandBus.execute(new LoginUserCommand(user.id, deviceId));

		const decodedAccessToken = this.jwtService.decode(result.accessToken);
		const decodedRefreshToken = this.jwtService.decode(result.refreshToken);

		await this.commandBus.execute(
			new CreateDeviceCommand(
				user.id,
				deviceDetails.deviceName,
				deviceDetails.ip,
				user.login,
				decodedRefreshToken.iat,
				decodedRefreshToken.deviceId,
				decodedAccessToken.exp
			)
		);

		return res
			.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true })
			.status(HttpStatus.OK)
			.send({ accessToken: result.accessToken });
	}

	@UseGuards(JwtBearerGuard)
	@Get('me')
	@HttpCode(HttpStatus.OK)
	async getProfile(@UserFromReq() user: UserFromGuard) {
		const userEmail = (await this.usersQueryRepository.findUserById(user.id)).email;

		return {
			email: userEmail,
			login: user.login,
			userId: user.id,
		};
	}

	@UseGuards(JwtRefreshGuard)
	@Post('refresh-token')
	@HttpCode(HttpStatus.OK)
	async getRefreshToken(@UserFromReq() user: UserFromGuard, @DeviceIdFromReq() deviceId: string, @Res() res: Response) {
		const result = await this.commandBus.execute(new LoginUserCommand(user.id, deviceId));

		const decodedAccessToken = this.jwtService.decode(result.accessToken);
		const decodedRefreshToken = this.jwtService.decode(result.refreshToken);
		await this.commandBus.execute(new UpdateDeviceCommand(deviceId, decodedRefreshToken.iat, decodedAccessToken.exp));

		return res
			.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true })
			.status(HttpStatus.OK)
			.send({
				accessToken: result.accessToken,
			});
	}

	@UseGuards(JwtRefreshGuard)
	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@Res() res: Response, @DeviceIdFromReq() deviceId: string) {
		await this.commandBus.execute(new DeviceLogoutCommand(deviceId));
		return res.clearCookie('refreshToken').sendStatus(HttpStatus.NO_CONTENT);
	}

	@UseGuards(ThrottlerGuard)
	@Post('registration-confirmation')
	@HttpCode(HttpStatus.NO_CONTENT)
	async confirmRegistration(@Body() codeInputModel: confirmationCodeInputDto) {
		const result = await this.commandBus.execute(new RegistrationConfirmEmailCommand(codeInputModel.code));
		return result;
	}

	//@UseGuards(ThrottlerGuard)
	@Post('registration-email-resending')
	@HttpCode(HttpStatus.NO_CONTENT)
	async resendEmail(@Body() emailInputModel: emailInputDto) {
		const result = await this.commandBus.execute(new RegistrationResendEmailCommand(emailInputModel.email));
		return result;
	}

	@UseGuards(ThrottlerGuard)
	@Post('password-recovery')
	@HttpCode(HttpStatus.NO_CONTENT)
	async recoverPassword(@Body() inputModel: emailInputDto) {
		const result = await this.commandBus.execute(new PasswordRecoveryCommand(inputModel.email));
		return result;
	}

	@UseGuards(ThrottlerGuard)
	@Post('new-password')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updatePassword(@Body() inputModel: newPasswordInputDto) {
		return await this.commandBus.execute(new PasswordUpdateCommand(inputModel));
	}
}
