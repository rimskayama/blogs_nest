import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns/add';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDto, UserInputDto } from '../users.types';
import { UsersRepository } from '../users.repository';

export class CreateUserCommand {
	constructor(public inputModel: UserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
	constructor(private readonly usersRepository: UsersRepository) {}
	async execute(command: CreateUserCommand): Promise<UserDto | boolean> {
		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(command.inputModel.password, passwordSalt);

		const newUser = {
			id: uuidv4(),
			login: command.inputModel.login,
			email: command.inputModel.email,
			passwordHash: passwordHash,
			passwordSalt: passwordSalt,
			createdAt: new Date(),
			emailConfirmationCode: uuidv4(),
			emailExpirationDate: new Date(),
			emailConfirmationStatus: true,
			passwordRecoveryCode: uuidv4(),
			passwordExpirationDate: add(new Date(), {
				hours: 1,
				minutes: 3,
			}),
		};

		return this.usersRepository.createUser(newUser);
	}
}
