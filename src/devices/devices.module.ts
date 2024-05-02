import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevicesController } from './devices.controller';
import { DevicesRepository } from './devices.repository';
import { DevicesQueryRepository } from './devices.query.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy } from '../auth/passport/strategies/jwt-refresh.strategy';
import { RefreshTokenValidationUseCase } from '../auth/use-cases/validations/validate-refresh-token.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { AccessTokenValidationUseCase } from '../auth/use-cases/validations/validate-access-token.use-case';
import { CreateDeviceUseCase } from './use-cases/create-device.use-case';
import { UpdateDeviceUseCase } from './use-cases/update-device-tokens.use-case';
import { TerminateAllSessionsUseCase } from './use-cases/terminate-all-sessions.use-case';
import { TerminateSessionUseCase } from './use-cases/terminate-session.use-case';

const strategies = [JwtRefreshTokenStrategy];
const services = [JwtService];
const adapters = [DevicesRepository, DevicesQueryRepository];
const useCases = [
	RefreshTokenValidationUseCase,
	AccessTokenValidationUseCase,
	CreateDeviceUseCase,
	UpdateDeviceUseCase,
	TerminateAllSessionsUseCase,
	TerminateSessionUseCase,
];

@Module({
	imports: [ConfigModule.forRoot(), PassportModule, CqrsModule],
	controllers: [DevicesController],
	providers: [...services, ...adapters, ...strategies, ...useCases],
})
export class DevicesModule {}
