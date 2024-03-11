import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from '../../constants';
import { cookieExtractor } from '../../utils/cookie.extractor';
import { Request } from 'express';
import { DevicesRepository } from '../../../devices/devices.repository';
import { DeviceDto } from 'src/devices/devices.types';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh') {
	constructor(private devicesRepository: DevicesRepository) {
		super({
			jwtFromRequest: cookieExtractor,
			secretOrKey: jwtConstants.refreshTokenSecret,
			passReqToCallback: true,
		});
	}

	async validate(request: Request, payload: any) {
		let device: DeviceDto | false;
		try {
			device = await this.devicesRepository.findDevice(payload.deviceId, payload.iat);
		} catch (e) {
			return false;
		}
		if (!device) return false;
		return {
			id: payload.sub,
			deviceId: payload.deviceId,
		};
	}
}
