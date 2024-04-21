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
}
