import { DeviceViewDto } from './devices.types';
import { devicesMapping } from '../utils/mapping';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from './device.entity';
import { Model } from 'mongoose';

@Injectable()
export class DevicesQueryRepository {
	constructor(
		@InjectModel(Device.name)
		private deviceModel: Model<DeviceDocument>
	) {}
	async findDevices(userId: string): Promise<DeviceViewDto[]> {
		const allDevices = await this.deviceModel.find({ userId: userId }, {});
		return devicesMapping(allDevices);
	}
}
