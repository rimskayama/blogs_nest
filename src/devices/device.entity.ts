import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeviceViewDto } from './devices.types';

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
	@Prop({ required: true })
	userId: string;
	@Prop({ required: true })
	ip: string;
	@Prop({ required: true })
	title: string;
	@Prop({ required: true })
	lastActiveDate: number;
	@Prop({ required: true })
	deviceId: string;
	@Prop({ required: true })
	expDate: string;

	static getViewDevice(deviceFromDb: Device): DeviceViewDto {
		return {
			ip: deviceFromDb.ip,
			title: deviceFromDb.title,
			lastActiveDate: Math.floor(deviceFromDb.lastActiveDate / 1000).toString(),
			deviceId: deviceFromDb.deviceId,
		};
	}
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
