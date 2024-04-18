import { Controller, Delete, HttpCode, Inject } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';

@Controller('testing')
export class TestingController {
	constructor(@Inject(UsersRepository) protected usersRepository: UsersRepository) {}

	@Delete('all-data')
	@HttpCode(204)
	async deleteAll() {
		await this.usersRepository.deleteAll();
	}
}
