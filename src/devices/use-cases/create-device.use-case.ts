import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../devices.repository';
import { DeviceViewDto } from '../devices.types';

export class CreateDeviceCommand {
	constructor(
		public userId: string,
		public deviceName: string,
		public ip: string,
		public userLogin: string,
		public lastActiveDate: number,
		public deviceId: string,
		public expirationDate: number
	) {}
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase implements ICommandHandler<CreateDeviceCommand> {
	constructor(private readonly devicesRepository: DevicesRepository) {}
	async execute(command: CreateDeviceCommand): Promise<DeviceViewDto | boolean> {
		const device = {
			userId: command.userId,
			userLogin: command.userLogin,
			ip: command.ip,
			title: command.deviceName,
			lastActiveDate: command.lastActiveDate,
			deviceId: command.deviceId,
			tokenExpirationDate: command.expirationDate,
		};
		return await this.devicesRepository.createNewDevice(device);
	}
}
