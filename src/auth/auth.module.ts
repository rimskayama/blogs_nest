import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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
	providers: [
		JwtService,
		AuthService,
		UsersService,
		DevicesService,
		UsersRepository,
		UsersQueryRepository,
		DevicesRepository,
		DevicesQueryRepository,
		LocalStrategy,
		JwtBearerStrategy,
		JwtRefreshTokenStrategy,
		emailExistsRule,
		loginExistsRule,
		emailConfirmedRule,
		confirmationCodeExistsRule,
		recoveryCodeExistsRule,
	],
})
export class AuthModule {}
