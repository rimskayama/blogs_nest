import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../repositories/devices.repository';
import { exceptionResultType } from '../../../exceptions/exception.types';

export class DeviceLogoutCommand {
	constructor(public deviceId: string) {}
}

@CommandHandler(DeviceLogoutCommand)
export class DeviceLogoutUseCase implements ICommandHandler<DeviceLogoutCommand> {
	constructor(private readonly devicesRepository: DevicesRepository) {}
	async execute(command: DeviceLogoutCommand): Promise<exceptionResultType | boolean> {
		return await this.devicesRepository.terminateSession(command.deviceId);
	}
}
