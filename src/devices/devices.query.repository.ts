import { DeviceDto } from './devices.types';
import { devicesMapping } from '../utils/mapping';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';

@Injectable()
export class DevicesQueryRepository {
	constructor(@InjectRepository(Device) private readonly devicesRepository: Repository<Device>) {}
	async findDevices(userId: string): Promise<DeviceDto[]> {
		try {
			const result = await this.devicesRepository
				.createQueryBuilder('d')
				.select(['d.userId', 'd.ip', 'd.title', 'd.lastActiveDate', 'd.deviceId'])
				.where(`d.userId = :userId`, {
					userId: userId,
				})
				.getMany();
			return devicesMapping(result);
		} catch (error) {
			console.error('Error finding devices:', error);
		}
	}

	async findDeviceByDeviceId(deviceId: string) {
		try {
			const result = await this.devicesRepository
				.createQueryBuilder('d')
				.leftJoin('d.user', 'u')
				.select(['d.userId', 'd.ip', 'd.title', 'd.lastActiveDate', 'd.deviceId', 'u.login'])
				.where(`d.deviceId = :deviceId`, {
					deviceId: deviceId,
				})
				.getOne();
			return result;
		} catch (error) {
			console.error('Error finding device by id:', error);
			return null;
		}
	}
	async findDevice(deviceId: string, lastActiveDate: number) {
		try {
			const result = await this.devicesRepository
				.createQueryBuilder('d')
				.select(['d.ip', 'd.title', 'd.lastActiveDate', 'd.deviceId'])
				.where(`d.deviceId = :deviceId`, {
					deviceId: deviceId,
				})
				.andWhere(`d.lastActiveDate = :lastActiveDate`, {
					lastActiveDate: lastActiveDate,
				})
				.getOne();
			return result;
		} catch (error) {
			console.error('Error finding device:', error);
			return false;
		}
	}
	async findDeviceByToken(userId: string, lastActiveDate: number, tokenExpirationDate: number) {
		try {
			const result = await this.devicesRepository
				.createQueryBuilder('d')
				.leftJoin('d.user', 'u')
				.select(['d.ip', 'd.title', 'd.lastActiveDate', 'd.deviceId', 'u.id', 'u.login'])
				.where(`d.userId = :userId`, {
					userId: userId,
				})
				.andWhere(`d.lastActiveDate = :lastActiveDate`, {
					lastActiveDate: lastActiveDate,
				})
				.andWhere(`d.tokenExpirationDate = :tokenExpirationDate`, {
					tokenExpirationDate: tokenExpirationDate,
				})
				.getOne();
			return result;
		} catch (error) {
			console.error('Error finding device:', error);
			return null;
		}
	}
}
