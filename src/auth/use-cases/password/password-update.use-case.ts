import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/users.repository';
import * as bcrypt from 'bcrypt';
import { newPasswordInputDto } from 'src/users/users.types';

export class PasswordUpdateCommand {
	constructor(public inputModel: newPasswordInputDto) {}
}

@CommandHandler(PasswordUpdateCommand)
export class PasswordUpdateUseCase implements ICommandHandler<PasswordUpdateCommand> {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute(command: PasswordUpdateCommand): Promise<boolean> {
		const userByCode = await this.usersRepository.findByRecoveryCode(command.inputModel.recoveryCode);

		if (!userByCode) return false;

		if (
			userByCode.passwordConfirmation.recoveryCode === command.inputModel.recoveryCode &&
			userByCode.passwordConfirmation.expirationDate > new Date()
		) {
			const passwordSalt = await bcrypt.genSalt(10);
			const passwordHash = await bcrypt.hash(command.inputModel.newPassword, passwordSalt);
			return await this.usersRepository.updatePassword(userByCode._id, passwordHash, passwordSalt);
		} else return false;
	}
}
