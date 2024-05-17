import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../devices.repository';
import { DeviceDto } from '../devices.types';

export class TerminateAllSessionsCommand {
	constructor(
		public userId: string,
		public deviceId: string
	) {}
}

@CommandHandler(TerminateAllSessionsCommand)
export class TerminateAllSessionsUseCase implements ICommandHandler<TerminateAllSessionsCommand> {
	constructor(private readonly devicesRepository: DevicesRepository) {}
	async execute(command: TerminateAllSessionsCommand): Promise<DeviceDto | boolean> {
		return await this.devicesRepository.terminateAllSessions(command.userId, command.deviceId);
	}
}
