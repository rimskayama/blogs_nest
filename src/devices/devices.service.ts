import { DevicesRepository } from './devices.repository';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DevicesService {
	constructor(
		private readonly devicesRepository: DevicesRepository,
		private readonly jwtService: JwtService
	) {}

	async createNewSession(refreshToken: string, deviceName: string, ip: string, userId: string, expDate: string) {
		const decodedToken = this.jwtService.decode(refreshToken);
		const deviceId = decodedToken.deviceId;
		const lastActiveDate = decodedToken.iat;

		const device = {
			userId: userId,
			ip: ip,
			title: deviceName,
			lastActiveDate: lastActiveDate,
			deviceId: deviceId,
			expDate: expDate,
		};
		return await this.devicesRepository.createNewSession(device);
	}

	async getSession(refreshToken: string) {
		let decodedToken: any;
		let deviceId: string;
		let lastActiveDate: number;
		try {
			decodedToken = this.jwtService.decode(refreshToken);
			deviceId = decodedToken.deviceId;
			lastActiveDate = decodedToken.iat;
		} catch (e) {
			return false;
		}

		return await this.devicesRepository.findDevice(deviceId, lastActiveDate);
	}

	async getSessionByDeviceId(deviceId: string) {
		const session = await this.devicesRepository.getSessionByDeviceId(deviceId);

		if (session) {
			return session;
		} else {
			return false;
		}
	}

	async updateLastActiveDate(deviceId: string, lastActiveDate: number) {
		return await this.devicesRepository.updateLastActiveDate(deviceId, lastActiveDate);
	}

	async terminateAllSessions(userId: string, deviceId: string) {
		return await this.devicesRepository.terminateAllSessions(userId, deviceId);
	}

	async terminateSession(deviceId: string) {
		return await this.devicesRepository.terminateSession(deviceId);
	}
}
