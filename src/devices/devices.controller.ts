import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Request,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesQueryRepository } from './devices.query.repository';
import { exceptionHandler } from '../exceptions/exception.handler';
import { StatusCode, deviceIdField, deviceNotFound, forbidden } from '../exceptions/exception.constants';
import { JwtRefreshGuard } from '../auth/passport/guards/jwt-refresh.guard';
import { UserFromReq } from '../auth/decorators/userId.decorator';
import { UserFromGuard } from '../users/users.types';

@Controller('security/devices')
export class DevicesController {
	constructor(
		private readonly devicesService: DevicesService,
		private readonly devicesQueryRepository: DevicesQueryRepository
	) {}

	@UseGuards(JwtRefreshGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	async getDevices(@Request() req, @UserFromReq() user: UserFromGuard) {
		const result = await this.devicesQueryRepository.findDevices(user.id);
		return result;
	}

	@UseGuards(JwtRefreshGuard)
	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteAllOthersSessions(@Request() req) {
		const deviceIdFromRT = req.user.deviceId;
		const session = await this.devicesQueryRepository.findDeviceByDeviceId(deviceIdFromRT);

		if (session) {
			return await this.devicesService.terminateAllSessions(session.userId, session.deviceId);
		} else throw new UnauthorizedException();
	}

	@UseGuards(JwtRefreshGuard)
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteSession(@Request() req, @Param('id') deviceIdFromReq: string) {
		//Req
		if (!deviceIdFromReq) {
			return exceptionHandler(StatusCode.NotFound, deviceNotFound, deviceIdField);
		}
		const userFromReq = await this.devicesQueryRepository.findDeviceByDeviceId(deviceIdFromReq);
		if (!userFromReq) {
			return exceptionHandler(StatusCode.NotFound, deviceNotFound, deviceIdField);
		}

		//RT
		const deviceIdFromRT = req.user.deviceId;
		const userFromRT = await this.devicesQueryRepository.findDeviceByDeviceId(deviceIdFromRT);
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
