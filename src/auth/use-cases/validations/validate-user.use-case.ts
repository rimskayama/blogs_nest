import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/repositories/users.repository';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/domain/user.entity';

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
			confirmation = user.emailConfirmationStatus;
		} catch (e) {
			return null;
		}
		if (!user || !confirmation) return null;
		const passwordHash = await bcrypt.hash(command.password, user.passwordSalt);
		if (user.passwordHash !== passwordHash) {
			return null;
		}
		return user;
	}
}
