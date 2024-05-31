import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceType } from '../devices.types';
import { Device } from '../domain/device.entity';

@Injectable()
export class DevicesRepository {
	constructor(@InjectRepository(Device) private readonly devicesRepository: Repository<Device>) {}

	async createNewDevice(device: DeviceType) {
		try {
			const result = await this.devicesRepository.save(device);
			return Device.getViewDevice(result);
		} catch (error) {
			console.error('Error creating device:', error);
		}
	}

	async updateLastActiveDate(deviceId: string, lastActiveDate: number, tokenExpirationDate: number) {
		try {
			const device = await this.devicesRepository
				.createQueryBuilder('d')
				.where('d.deviceId = :deviceId', {
					deviceId: deviceId,
				})
				.getOne();
			device.lastActiveDate = lastActiveDate;
			device.tokenExpirationDate = tokenExpirationDate;
			await this.devicesRepository.save(device);
			return true;
		} catch (error) {
			console.error('Error updating lastActiveDate:', error);
		}
	}

	async terminateAllSessions(userId: string, deviceId: string) {
		try {
			const result = await this.devicesRepository
				.createQueryBuilder('d')
				.delete()
				.from(Device)
				.where(`userId = :userId`, {
					userId: userId,
				})
				.andWhere('deviceId != :deviceId', { deviceId: deviceId })
				.execute();

			return result.affected === 1;
		} catch (error) {
			console.error('Error deleting all sessions:', error);
		}
	}

	async terminateSession(deviceId: string) {
		try {
			const result = await this.devicesRepository
				.createQueryBuilder('d')
				.delete()
				.from(Device)
				.where('deviceId = :deviceId', { deviceId: deviceId })
				.execute();
			return result.affected === 1;
		} catch (error) {
			console.error('Error deleting session:', error);
		}
	}
}
