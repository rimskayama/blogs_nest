import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceDto } from 'src/devices/devices.types';
import { DevicesRepository } from '../../../devices/devices.repository';

export class RefreshTokenValidationCommand {
	constructor(public payload: any) {}
}

@CommandHandler(RefreshTokenValidationCommand)
export class RefreshTokenValidationUseCase implements ICommandHandler<RefreshTokenValidationCommand> {
	constructor(private readonly devicesRepository: DevicesRepository) {}

	async execute(command: RefreshTokenValidationCommand) {
		let device: DeviceDto | false;
		try {
			device = await this.devicesRepository.findDevice(command.payload.deviceId, command.payload.iat);
		} catch (e) {
			return false;
		}
		if (!device) return false;
		else return device;
	}
}
