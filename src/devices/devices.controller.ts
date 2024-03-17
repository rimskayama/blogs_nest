import { Controller, Delete, Get, HttpCode, Param, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesQueryRepository } from './devices.query.repository';
import { cookieExtractor } from '../auth/utils/cookie.extractor';
import { exceptionHandler } from '../exceptions/exception.handler';
import { StatusCode, deviceIdField, deviceNotFound, forbidden } from '../exceptions/exception.constants';
import { JwtRefreshGuard } from '../auth/passport/guards/jwt-refresh.guard';
import { UserFromReq } from '../auth/decorators/userId.decorator';
import { DevicesRepository } from '../devices/devices.repository';

@Controller('security/devices')
export class DevicesController {
	constructor(
		private readonly devicesService: DevicesService,
		private readonly devicesQueryRepository: DevicesQueryRepository,
		private readonly devicesRepository: DevicesRepository
	) {}

	@UseGuards(JwtRefreshGuard)
	@Get()
	@HttpCode(200)
	async getDevices(@Request() req, @UserFromReq() userId: string) {
		const result = await this.devicesQueryRepository.findDevices(userId);
		return result;
	}

	@UseGuards(JwtRefreshGuard)
	@Delete()
	@HttpCode(204)
	async deleteSession(@Request() req) {
		const refreshToken = await cookieExtractor(req);
		const session = await this.devicesService.getSession(refreshToken);

		if (session) {
			return await this.devicesService.terminateAllSessions(session.userId, session.deviceId);
		} else throw new UnauthorizedException();
	}

	@UseGuards(JwtRefreshGuard)
	@Delete(':id')
	@HttpCode(204)
	async deleteAllOthersSessions(@Request() req, @Param('id') deviceIdFromReq: string) {
		const refreshToken = await cookieExtractor(req);
		const session = await this.devicesService.getSession(refreshToken);
		if (!session) {
			return new UnauthorizedException();
		}
		if (!deviceIdFromReq) {
			return exceptionHandler(StatusCode.NotFound, deviceNotFound, deviceIdField);
		}
		const userFromReq = await this.devicesRepository.getSessionByDeviceId(deviceIdFromReq);
		if (!userFromReq) {
			return exceptionHandler(StatusCode.NotFound, deviceNotFound, deviceIdField);
		}

		//RT
		if (!req.user.deviceId) {
			return exceptionHandler(StatusCode.NotFound, deviceNotFound, deviceIdField);
		}
		const deviceIdFromRT = req.user.deviceId;
		const userFromRT = await this.devicesRepository.getSessionByDeviceId(deviceIdFromRT);

		//Req
		if (userFromReq.userId.toString() !== userFromRT.userId.toString()) {
			return exceptionHandler(StatusCode.Forbidden, forbidden, deviceIdField);
		} else {
			return await this.devicesService.terminateSession(deviceIdFromReq);
		}
	}
}
