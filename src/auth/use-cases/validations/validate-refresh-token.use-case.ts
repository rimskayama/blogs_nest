import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesQueryRepository } from '../../../devices/repositories/devices.query.repository';
import { Device } from 'src/devices/domain/device.entity';

export class RefreshTokenValidationCommand {
	constructor(public payload: any) {}
}

@CommandHandler(RefreshTokenValidationCommand)
export class RefreshTokenValidationUseCase implements ICommandHandler<RefreshTokenValidationCommand> {
	constructor(private readonly devicesQueryRepository: DevicesQueryRepository) {}

	async execute(command: RefreshTokenValidationCommand) {
		let device: Device | false;
		try {
			device = await this.devicesQueryRepository.findDevice(command.payload.deviceId, command.payload.iat);
		} catch (e) {
			return false;
		}
		if (!device) return false;
		else return device;
	}
}
