import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/user.entity';
import { UsersQueryRepository } from '../users/users.query.repository';
import { LocalStrategy } from './passport/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { Device, DeviceSchema } from '../devices/device.entity';
import { DevicesService } from '../devices/devices.service';
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
import { LoginUserUseCase } from './use-cases/login/login-user.use-case';
import { RegistrationUseCase } from './use-cases/registration/registration.use-case';
import { RefreshTokenValidationUseCase } from './use-cases/validations/validate-refresh-token.use-case';
import { UserValidationUseCase } from './use-cases/validations/validate-user.use-case';
import { RegistrationResendEmailUseCase } from './use-cases/registration/registration-resend-email.use-case';
import { RegistrationConfirmEmailUseCase } from './use-cases/registration/registration-confirm-email.user-case';
import { PasswordRecoveryUseCase } from './use-cases/password/password-recovery.use-case';
import { PasswordUpdateUseCase } from './use-cases/password/password-update.use-case';

const strategies = [LocalStrategy, JwtBearerStrategy, JwtRefreshTokenStrategy];
const services = [JwtService, UsersService, DevicesService];
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
];

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		UsersModule,
		MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
		PassportModule,
	],
	controllers: [AuthController],
	providers: [...services, ...adapters, ...strategies, ...validators, ...useCases],
})
export class AuthModule {}
