import { DeviceViewDto } from './devices.types';
import { devicesMapping } from '../utils/mapping';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DevicesQueryRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}
	async findDevices(userId: string): Promise<DeviceViewDto[]> {
		const query = `
        SELECT d.*
		FROM public."Devices" d
		WHERE d."userId" = $1;
    `;

		try {
			const result = await this.dataSource.query(query, [userId]);
			return devicesMapping(result);
		} catch (error) {
			console.error('Error finding device:', error);
		}
	}

	async findDeviceByDeviceId(deviceId: string) {
		const query = `
        SELECT "userId", "ip", "title", "lastActiveDate", "deviceId"
		FROM public."Devices" d
		WHERE d."deviceId" = $1;
    `;

		try {
			const result = await this.dataSource.query(query, [deviceId]);
			return result[0];
		} catch (error) {
			console.error('Error finding device:', error);
			return null;
		}
	}
	async findDevice(deviceId: string, lastActiveDate: number) {
		const query = `
        SELECT "ip", "title", "lastActiveDate", "deviceId"
		FROM public."Devices" d
		WHERE d."deviceId" = $1 AND d."lastActiveDate" = $2;
    `;

		try {
			const result = await this.dataSource.query(query, [deviceId, lastActiveDate]);
			if (result.length === 0 || lastActiveDate < result[0].lastActiveDate) {
				return false;
			}
			return result;
		} catch (error) {
			console.error('Error finding device:', error);
		}
	}
	async findDeviceByToken(userId: string, lastActiveDate: number, tokenExpirationDate: number) {
		const query = `
        SELECT "userId", "userLogin", "ip", "title", "lastActiveDate", "deviceId"
		FROM public."Devices" d
		WHERE d."userId" = $1 AND d."lastActiveDate" = $2 AND d."tokenExpirationDate" = $3;
    `;

		try {
			const result = await this.dataSource.query(query, [userId, lastActiveDate, tokenExpirationDate]);
			if (result.length !== 0) {
				return result[0];
			}
		} catch (error) {
			console.error('Error finding device:', error);
			return null;
		}
	}
}
