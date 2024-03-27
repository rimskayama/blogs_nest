import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from 'src/users/user.entity';
import { UsersRepository } from '../../../users/users.repository';
import * as bcrypt from 'bcrypt';

export class UserValidationCommand {
	constructor(
		public loginOrEmail: string,
		public password: string
	) {}
}

@CommandHandler(UserValidationCommand)
export class UserValidationUseCase implements ICommandHandler<UserValidationCommand> {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute(command: UserValidationCommand): Promise<null | User> {
		const user = await this.usersRepository.findByLoginOrEmail(command.loginOrEmail);
		let confirmation: boolean;
		try {
			confirmation = user.emailConfirmation.isConfirmed;
		} catch (e) {
			return null;
		}
		if (!user || !confirmation) return null;
		const passwordHash = await bcrypt.hash(command.password, user.accountData.passwordSalt);
		if (user.accountData.passwordHash !== passwordHash) {
			return null;
		}
		return user;
	}
}
