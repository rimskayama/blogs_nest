import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
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
			_id: new ObjectId(),
			accountData: {
				login: inputModel.login,
				email: inputModel.email,
				passwordHash: passwordHash,
				passwordSalt: passwordSalt,
				createdAt: new Date().toISOString(),
			},
			emailConfirmation: {
				confirmationCode: uuidv4(),
				expirationDate: new Date(),
				isConfirmed: true,
			},
			passwordConfirmation: {
				recoveryCode: uuidv4(),
				expirationDate: add(new Date(), {
					hours: 1,
					minutes: 3,
				}),
			},
		};

		return this.usersRepository.createUser(newUser);
	}

	async deleteUser(id: string) {
		return await this.usersRepository.deleteUser(new ObjectId(id));
	}

	async deleteAll() {
		return await this.usersRepository.deleteAll();
	}
}
