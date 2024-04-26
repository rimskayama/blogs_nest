import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async deleteUser(id: string) {
		return await this.usersRepository.deleteUser(id);
	}
}
