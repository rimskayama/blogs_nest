import { DevicesRepository } from './devices.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DevicesService {
	constructor(private readonly devicesRepository: DevicesRepository) {}

	async updateLastActiveDate(deviceId: string, lastActiveDate: number, expirationDate: number) {
		return await this.devicesRepository.updateLastActiveDate(deviceId, lastActiveDate, expirationDate);
	}

	async terminateAllSessions(userId: string, deviceId: string) {
		return await this.devicesRepository.terminateAllSessions(userId, deviceId);
	}

	async terminateSession(deviceId: string) {
		return await this.devicesRepository.terminateSession(deviceId);
	}
}
