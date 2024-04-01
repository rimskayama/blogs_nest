import { UsersRepository } from '../../../users/users.repository';
import { emailManager } from '../../mail/email.manager';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class RegistrationResendEmailCommand {
	constructor(public email: string) {}
}

@CommandHandler(RegistrationResendEmailCommand)
export class RegistrationResendEmailUseCase implements ICommandHandler<RegistrationResendEmailCommand> {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute(command: RegistrationResendEmailCommand): Promise<boolean> {
		const user = await this.usersRepository.findByLoginOrEmail(command.email);

		if (user) {
			const userWithUpdatedCode = await this.usersRepository.updateConfirmationCode(user._id);

			if (userWithUpdatedCode) {
				await emailManager.resendEmail(command.email, userWithUpdatedCode.emailConfirmation.confirmationCode);
				return true;
			}
			return false;
		}
		return true;
	}
}
