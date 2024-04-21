import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { devicesMapping } from '../utils/mapping';
import { DeviceType } from './devices.types';

@Injectable()
export class DevicesRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}

	async createNewSession(device: DeviceType) {
		const query = `
        INSERT INTO public."Devices"(
            "userId", "ip", "title", "lastActiveDate", "deviceId", "tokenExpirationDate")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

		const values = [
			device.userId,
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
        SELECT "userId", "ip", "title", "lastActiveDate", "deviceId"
		FROM public."Devices" d
		WHERE d."userId" = $1 AND d."lastActiveDate" = $2 AND d."tokenExpirationDate" = $3;
    `;

		try {
			const result = await this.dataSource.query(query, [userId, lastActiveDate, tokenExpirationDate]);
			if (result.length !== 0) {
				return result;
			}
		} catch (error) {
			console.error('Error finding device:', error);
			return null;
		}
	}

	async getSessionByDeviceId(deviceId: string) {
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
