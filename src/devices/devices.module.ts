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

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
		PassportModule,
	],
	controllers: [DevicesController],
	providers: [JwtService, DevicesService, DevicesRepository, DevicesQueryRepository, JwtRefreshTokenStrategy],
})
export class DevicesModule {}
