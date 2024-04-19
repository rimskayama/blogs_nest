import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UsersRepository } from './users.repository';
import { Inject, Injectable } from '@nestjs/common';
import { UserDto, UserInputDto } from './users.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	constructor(@Inject(UsersRepository) protected usersRepository: UsersRepository) {}

	async createUser(inputModel: UserInputDto): Promise<UserDto> {
		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(inputModel.password, passwordSalt);

		const newUser = {
			id: uuidv4(),
			login: inputModel.login,
			email: inputModel.email,
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

	async deleteUser(id: string) {
		return await this.usersRepository.deleteUser(id);
	}
}
