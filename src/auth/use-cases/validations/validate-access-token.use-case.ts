import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceDto } from 'src/devices/devices.types';
import { DevicesRepository } from '../../../devices/devices.repository';

export class AccessTokenValidationCommand {
	constructor(public payload: any) {}
}

@CommandHandler(AccessTokenValidationCommand)
export class AccessTokenValidationUseCase implements ICommandHandler<AccessTokenValidationCommand> {
	constructor(private readonly devicesRepository: DevicesRepository) {}

	async execute(command: AccessTokenValidationCommand) {
		let device: DeviceDto | false;
		try {
			device = await this.devicesRepository.findDeviceByToken(
				command.payload.sub,
				command.payload.iat,
				command.payload.exp
			);
		} catch (e) {
			return false;
		}
		if (!device) return false;
		else return device;
	}
}
