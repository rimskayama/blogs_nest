import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/repositories/users.repository';
import * as bcrypt from 'bcrypt';
import { newPasswordInputDto } from 'src/users/users.dto';

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
			userByCode.passwordRecoveryCode === command.inputModel.recoveryCode &&
			userByCode.passwordExpirationDate > new Date()
		) {
			const passwordSalt = await bcrypt.genSalt(10);
			const passwordHash = await bcrypt.hash(command.inputModel.newPassword, passwordSalt);
			return await this.usersRepository.updatePassword(userByCode.id, passwordHash, passwordSalt);
		} else return false;
	}
}
