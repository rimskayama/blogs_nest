import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { devicesMapping } from '../utils/mapping';
import { DeviceType } from './devices.types';

@Injectable()
export class DevicesRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}

	async createNewDevice(device: DeviceType) {
		const query = `
        INSERT INTO public."Devices"(
            "userId", "userLogin", "ip", "title", "lastActiveDate", "deviceId", "tokenExpirationDate")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

		const values = [
			device.userId,
			device.userLogin,
			device.ip,
			device.title,
			device.lastActiveDate,
			device.deviceId,
			device.tokenExpirationDate,
		];
		try {
			const result = await this.dataSource.query(query, values);
			return devicesMapping(result)[0];
		} catch (error) {
			console.error('Error creating device :', error);
		}
	}

	async updateLastActiveDate(deviceId: string, lastActiveDate: number, tokenExpirationDate: number) {
		const query = `
		UPDATE public."Devices" d
		SET "lastActiveDate"=$1, "tokenExpirationDate"=$2
		WHERE d."deviceId" = $3;
    `;
		try {
			return await this.dataSource.query(query, [lastActiveDate, tokenExpirationDate, deviceId]);
		} catch (error) {
			console.error('Error updating lastActiveDate:', error);
		}
	}

	async terminateAllSessions(userId: string, deviceId: string) {
		const query = `
		DELETE FROM public."Devices" d
		WHERE d."userId" = $1 AND d."deviceId" <> $2;
    `;

		try {
			return await this.dataSource.query(query, [userId, deviceId]);
		} catch (error) {
			console.error('Error deleting all sessions:', error);
		}
	}

	async terminateSession(deviceId: string) {
		const query = `
		DELETE FROM public."Devices" d
		WHERE d."deviceId" = $1;
    `;

		try {
			const result = await this.dataSource.query(query, [deviceId]);
			return result;
		} catch (error) {
			console.error('Error deleting session:', error);
		}
	}
}
