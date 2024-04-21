import { DevicesRepository } from './devices.repository';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DevicesService {
	constructor(
		private readonly devicesRepository: DevicesRepository,
		private readonly jwtService: JwtService
	) {}

	async createNewSession(accessToken: string, refreshToken: string, deviceName: string, ip: string, userId: string) {
		const decodedAccessToken = this.jwtService.decode(accessToken);
		const decodedRefreshToken = this.jwtService.decode(refreshToken);

		const device = {
			userId: userId,
			ip: ip,
			title: deviceName,
			lastActiveDate: decodedRefreshToken.iat,
			deviceId: decodedRefreshToken.deviceId,
			tokenExpirationDate: decodedAccessToken.exp,
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

	async updateLastActiveDate(accessToken: string, refreshToken: string, deviceId: string) {
		const decodedAccessToken = this.jwtService.decode(accessToken);
		const decodedRefreshToken = this.jwtService.decode(refreshToken);

		const lastActiveDate = decodedRefreshToken.iat;
		const tokenExpirationDate = decodedAccessToken.exp;
		return await this.devicesRepository.updateLastActiveDate(deviceId, lastActiveDate, tokenExpirationDate);
	}

	async terminateAllSessions(userId: string, deviceId: string) {
		return await this.devicesRepository.terminateAllSessions(userId, deviceId);
	}

	async terminateSession(deviceId: string) {
		return await this.devicesRepository.terminateSession(deviceId);
	}
}
