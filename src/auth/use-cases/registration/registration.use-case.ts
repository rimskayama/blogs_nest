import { UserDto, UserInputDto } from 'src/users/users.types';
import { add } from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../../users/users.repository';
import { emailManager } from '../../mail/email.manager';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class RegistrationCommand {
	constructor(public inputModel: UserInputDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase implements ICommandHandler<RegistrationCommand> {
	constructor(private readonly usersRepository: UsersRepository) {}
	async execute(command: RegistrationCommand): Promise<UserDto | boolean> {
		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(command.inputModel.password, passwordSalt);

		const newUser = {
			_id: new ObjectId(),
			accountData: {
				login: command.inputModel.login,
				email: command.inputModel.email,
				passwordHash: passwordHash,
				passwordSalt: passwordSalt,
				createdAt: new Date().toISOString(),
			},
			emailConfirmation: {
				confirmationCode: uuidv4(),
				expirationDate: new Date(),
				isConfirmed: false,
			},
			passwordConfirmation: {
				recoveryCode: uuidv4(),
				expirationDate: add(new Date(), {
					hours: 1,
					minutes: 3,
				}),
			},
		};
		const result = this.usersRepository.createUser(newUser);

		try {
			await emailManager.sendRegistrationEmail(newUser.accountData.email, newUser.emailConfirmation.confirmationCode);
		} catch (error) {
			console.error('error in send email:', error);
		}
		return result;
	}
}
