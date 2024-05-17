import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../devices.repository';
import { DeviceDto } from '../devices.types';

export class UpdateDeviceCommand {
	constructor(
		public deviceId: string,
		public lastActiveDate: number,
		public expirationDate: number
	) {}
}

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceUseCase implements ICommandHandler<UpdateDeviceCommand> {
	constructor(private readonly devicesRepository: DevicesRepository) {}
	async execute(command: UpdateDeviceCommand): Promise<DeviceDto | boolean> {
		return await this.devicesRepository.updateLastActiveDate(
			command.deviceId,
			command.lastActiveDate,
			command.expirationDate
		);
	}
}
