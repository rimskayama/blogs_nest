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
			const emailConfirmationCode = await this.usersRepository.updateConfirmationCode(user.id);

			if (emailConfirmationCode) {
				await emailManager.resendEmail(command.email, emailConfirmationCode);
				return true;
			}
			return false;
		}
		return true;
	}
}
