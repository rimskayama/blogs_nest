import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/users.repository';

export class RegistrationConfirmEmailCommand {
	constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmEmailCommand)
export class RegistrationConfirmEmailUseCase implements ICommandHandler<RegistrationConfirmEmailCommand> {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute(command: RegistrationConfirmEmailCommand): Promise<boolean> {
		const foundUserByCode = await this.usersRepository.findByConfirmationCode(command.code);

		if (!foundUserByCode) return false;

		if (foundUserByCode.emailConfirmation.isConfirmed) {
			return false;
		} else {
			if (
				foundUserByCode.emailConfirmation.confirmationCode === command.code &&
				foundUserByCode.emailConfirmation.expirationDate > new Date()
			) {
				return await this.usersRepository.updateConfirmation(foundUserByCode._id);
			} else return false;
		}
	}
}