import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { DevicesQueryRepository } from './repositories/devices.query.repository';
import { exceptionHandler } from '../exceptions/exception.handler';
import { StatusCode } from '../exceptions/exception.constants';
import { JwtRefreshGuard } from '../auth/passport/guards/jwt-refresh.guard';
import { UserFromReq } from '../auth/decorators/userId.decorator';
import { UserFromGuard } from '../users/users.types';
import { DeviceIdFromReq } from '../auth/decorators/deviceId.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { TerminateAllSessionsCommand } from './application/use-cases/terminate-all-sessions.use-case';
import { TerminateSessionCommand } from './application/use-cases/terminate-session.use-case';

@Controller('security/devices')
export class DevicesController {
	constructor(
		private commandBus: CommandBus,
		private readonly devicesQueryRepository: DevicesQueryRepository
	) {}

	@UseGuards(JwtRefreshGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	async getDevices(@UserFromReq() user: UserFromGuard) {
		const result = await this.devicesQueryRepository.findDevices(user.id);
		return result;
	}

	@UseGuards(JwtRefreshGuard)
	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteAllOtherSessions(@DeviceIdFromReq() deviceId: string) {
		const session = await this.devicesQueryRepository.findDeviceByDeviceId(deviceId);

		if (session) {
			return await this.commandBus.execute(new TerminateAllSessionsCommand(session.userId, session.deviceId));
		} else throw new UnauthorizedException();
	}

	@UseGuards(JwtRefreshGuard)
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteSession(@Param('id') deviceIdFromReq: string, @DeviceIdFromReq() deviceIdFromGuard: string) {
		const result = await this.commandBus.execute(new TerminateSessionCommand(deviceIdFromReq, deviceIdFromGuard));
		if (result.code !== StatusCode.Success) {
			return exceptionHandler(result.code, result.message, result.field);
		}
		return result;
	}
}
