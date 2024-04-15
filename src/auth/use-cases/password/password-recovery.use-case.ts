import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/users.repository';
import { emailManager } from '../../mail/email.manager';

export class PasswordRecoveryCommand {
	constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute(command: PasswordRecoveryCommand): Promise<boolean> {
		const user = await this.usersRepository.findByLoginOrEmail(command.email);

		if (user) {
			const passwordRecoveryCode = await this.usersRepository.updatePasswordRecoveryCode(user.id);
			try {
				await emailManager.sendPasswordRecoveryEmail(command.email, passwordRecoveryCode);
				return true;
			} catch (error) {
				console.error('mail error');
				return false;
			}
		} else return true;
	}
}
