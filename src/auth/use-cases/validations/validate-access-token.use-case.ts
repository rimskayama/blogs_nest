import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceDto } from 'src/devices/devices.types';
import { DevicesQueryRepository } from '../../../devices/devices.query.repository';

export class AccessTokenValidationCommand {
	constructor(public payload: any) {}
}

@CommandHandler(AccessTokenValidationCommand)
export class AccessTokenValidationUseCase implements ICommandHandler<AccessTokenValidationCommand> {
	constructor(private readonly devicesQueryRepository: DevicesQueryRepository) {}

	async execute(command: AccessTokenValidationCommand) {
		let device: DeviceDto | false;
		try {
			device = await this.devicesQueryRepository.findDeviceByToken(
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
