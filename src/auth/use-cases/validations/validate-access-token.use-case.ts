import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesQueryRepository } from '../../../devices/devices.query.repository';
import { DeviceType } from 'src/devices/devices.types';

export class AccessTokenValidationCommand {
	constructor(public payload: any) {}
}

@CommandHandler(AccessTokenValidationCommand)
export class AccessTokenValidationUseCase implements ICommandHandler<AccessTokenValidationCommand> {
	constructor(private readonly devicesQueryRepository: DevicesQueryRepository) {}

	async execute(command: AccessTokenValidationCommand) {
		let device: DeviceType | false;
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
