import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDto } from '../users.types';
import { UsersRepository } from '../users.repository';

export class DeleteUserCommand {
	constructor(public userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
	constructor(private readonly usersRepository: UsersRepository) {}
	async execute(command: DeleteUserCommand): Promise<UserDto | boolean> {
		return await this.usersRepository.deleteUser(command.userId);
	}
}
