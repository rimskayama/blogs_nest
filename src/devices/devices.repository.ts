import { Injectable } from '@nestjs/common';
import { Device } from './device.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceDocument } from './device.entity';
import { Model } from 'mongoose';

@Injectable()
export class DevicesRepository {
	constructor(
		@InjectModel(Device.name)
		private deviceModel: Model<DeviceDocument>
	) {}

	async save(device: DeviceDocument) {
		device.save();
	}
	async createNewSession(device: Device) {
		const newDevice = new this.deviceModel(device);
		return await this.save(newDevice);
	}

	async findDevice(deviceId: string, lastActiveDate: number) {
		const device = await this.deviceModel.findOne({ deviceId: deviceId, lastActiveDate: lastActiveDate });
		if (!device || lastActiveDate < device.lastActiveDate) {
			return false;
		}
		if (device) {
			return device;
		}
	}

	async getSessionByDeviceId(deviceId: string) {
		const session = await this.deviceModel.findOne({ deviceId: deviceId });
		if (session) {
			return session;
		}
		return null;
	}

	async updateLastActiveDate(deviceId: string, lastActiveDate: number) {
		return await this.deviceModel.updateOne({ deviceId }, { $set: { lastActiveDate: lastActiveDate } });
	}

	async terminateAllSessions(userId: string, deviceId: string) {
		return await this.deviceModel.deleteMany({ userId, deviceId: { $ne: deviceId } });
	}

	async terminateSession(deviceId: string) {
		await this.deviceModel.deleteOne({ deviceId: deviceId });
		const session = await this.deviceModel.findOne({ deviceId: deviceId });
		if (!session) {
			return true;
		}
		return false;
	}
}
