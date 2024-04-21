import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './device.entity';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DevicesRepository } from './devices.repository';
import { DevicesQueryRepository } from './devices.query.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy } from '../auth/passport/strategies/jwt-refresh.strategy';
import { RefreshTokenValidationUseCase } from '../auth/use-cases/validations/validate-refresh-token.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { AccessTokenValidationUseCase } from '../auth/use-cases/validations/validate-access-token.use-case';

const strategies = [JwtRefreshTokenStrategy];
const services = [JwtService, DevicesService];
const adapters = [DevicesRepository, DevicesQueryRepository];
const useCases = [RefreshTokenValidationUseCase, AccessTokenValidationUseCase];

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
		PassportModule,
		CqrsModule,
	],
	controllers: [DevicesController],
	providers: [...services, ...adapters, ...strategies, ...useCases],
})
export class DevicesModule {}
