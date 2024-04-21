import { Controller, Delete, Get, HttpCode, Param, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesQueryRepository } from './devices.query.repository';
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
	async deleteAllOthersSessions(@Request() req) {
		const deviceIdFromRT = req.user.deviceId;
		const session = await this.devicesRepository.getSessionByDeviceId(deviceIdFromRT);

		if (session) {
			return await this.devicesService.terminateAllSessions(session.userId, session.deviceId);
		} else throw new UnauthorizedException();
	}

	@UseGuards(JwtRefreshGuard)
	@Delete(':id')
	@HttpCode(204)
	async deleteSession(@Request() req, @Param('id') deviceIdFromReq: string) {
		//Req
		if (!deviceIdFromReq) {
			return exceptionHandler(StatusCode.NotFound, deviceNotFound, deviceIdField);
		}
		const userFromReq = await this.devicesRepository.getSessionByDeviceId(deviceIdFromReq);
		if (!userFromReq) {
			return exceptionHandler(StatusCode.NotFound, deviceNotFound, deviceIdField);
		}

		//RT
		const deviceIdFromRT = req.user.deviceId;
		const userFromRT = await this.devicesRepository.getSessionByDeviceId(deviceIdFromRT);
		if (!userFromRT) {
			return exceptionHandler(StatusCode.NotFound, deviceNotFound, deviceIdField);
		}

		if (userFromReq.userId !== userFromRT.userId) {
			return exceptionHandler(StatusCode.Forbidden, forbidden, deviceIdField);
		} else {
			return await this.devicesService.terminateSession(deviceIdFromReq);
		}
	}
}
