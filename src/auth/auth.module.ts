import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../users/users.repository';
import { UsersQueryRepository } from '../users/users.query.repository';
import { LocalStrategy } from './passport/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { DevicesRepository } from '../devices/devices.repository';
import { DevicesQueryRepository } from '../devices/devices.query.repository';
import { JwtBearerStrategy } from './passport/strategies/jwt-bearer.strategy';
import { JwtRefreshTokenStrategy } from './passport/strategies/jwt-refresh.strategy';
import {
	confirmationCodeExistsRule,
	emailConfirmedRule,
	emailExistsRule,
	loginExistsRule,
	recoveryCodeExistsRule,
} from './authentification';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoginUserUseCase } from './use-cases/login/login-user.use-case';
import { RegistrationUseCase } from './use-cases/registration/registration.use-case';
import { RefreshTokenValidationUseCase } from './use-cases/validations/validate-refresh-token.use-case';
import { UserValidationUseCase } from './use-cases/validations/validate-user.use-case';
import { RegistrationResendEmailUseCase } from './use-cases/registration/registration-resend-email.use-case';
import { RegistrationConfirmEmailUseCase } from './use-cases/registration/registration-confirm-email.user-case';
import { PasswordRecoveryUseCase } from './use-cases/password/password-recovery.use-case';
import { PasswordUpdateUseCase } from './use-cases/password/password-update.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { DeviceLogoutUseCase } from '../devices/use-cases/delete-device-logout.use-case';
import { DevicesModule } from '../devices/devices.module';

const strategies = [LocalStrategy, JwtBearerStrategy, JwtRefreshTokenStrategy];
const services = [JwtService];
const adapters = [UsersRepository, UsersQueryRepository, DevicesRepository, DevicesQueryRepository];
const validators = [
	emailExistsRule,
	loginExistsRule,
	emailConfirmedRule,
	confirmationCodeExistsRule,
	recoveryCodeExistsRule,
];
const useCases = [
	RegistrationUseCase,
	RegistrationResendEmailUseCase,
	RegistrationConfirmEmailUseCase,
	LoginUserUseCase,
	RefreshTokenValidationUseCase,
	UserValidationUseCase,
	PasswordRecoveryUseCase,
	PasswordUpdateUseCase,
	DeviceLogoutUseCase,
];

@Module({
	imports: [
		ConfigModule.forRoot(),
		UsersModule,
		DevicesModule,
		PassportModule,
		CqrsModule,
		ThrottlerModule.forRoot([
			{
				ttl: 10000,
				limit: 5,
			},
		]),
	],
	controllers: [AuthController],
	providers: [...services, ...adapters, ...strategies, ...validators, ...useCases],
})
export class AuthModule {}
