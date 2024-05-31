import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../repositories/devices.repository';
import { exceptionResultType } from '../../../exceptions/exception.types';
import { StatusCode, deviceIdField, deviceNotFound, forbidden } from '../../../exceptions/exception.constants';
import { DevicesQueryRepository } from '../../repositories/devices.query.repository';

export class TerminateSessionCommand {
	constructor(
		public deviceIdFromReq: string,
		public deviceIdFromGuard: string
	) {}
}

@CommandHandler(TerminateSessionCommand)
export class TerminateSessionUseCase implements ICommandHandler<TerminateSessionCommand> {
	constructor(
		private readonly devicesQueryRepository: DevicesQueryRepository,
		private readonly devicesRepository: DevicesRepository
	) {}
	async execute(command: TerminateSessionCommand): Promise<exceptionResultType | boolean> {
		//Req
		if (!command.deviceIdFromReq) {
			return {
				code: StatusCode.NotFound,
				field: deviceIdField,
				message: deviceNotFound,
			};
		}
		const userFromReq = await this.devicesQueryRepository.findDeviceByDeviceId(command.deviceIdFromReq);
		if (!userFromReq) {
			return {
				code: StatusCode.NotFound,
				field: deviceIdField,
				message: deviceNotFound,
			};
		}

		//RT
		const userFromRT = await this.devicesQueryRepository.findDeviceByDeviceId(command.deviceIdFromGuard);
		if (!userFromRT) {
			return {
				code: StatusCode.NotFound,
				field: deviceIdField,
				message: deviceNotFound,
			};
		}

		if (userFromReq.userId !== userFromRT.userId) {
			return {
				code: StatusCode.Forbidden,
				field: deviceIdField,
				message: forbidden,
			};
		} else {
			return await this.devicesRepository.terminateSession(command.deviceIdFromReq);
		}
	}
}
