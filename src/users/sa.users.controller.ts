import { UsersQueryRepository } from './repositories/users.query.repository';
import { getPagination } from '../utils/pagination';
import { QueryParameters } from '../utils/pagination.types';
import { UserInputDto } from './users.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { exceptionHandler } from '../exceptions/exception.handler';
import { StatusCode, userIdField, userNotFound } from '../exceptions/exception.constants';
import { BasicAuthGuard } from '../auth/passport/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './application/use-cases/create-user.use-case';
import { DeleteUserCommand } from './application/use-cases/delete-user.use-case';

@Controller('sa/users')
export class SuperAdminUsersController {
	constructor(
		private commandBus: CommandBus,
		private readonly usersQueryRepository: UsersQueryRepository
	) {}

	@UseGuards(BasicAuthGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	async getUsers(@Query() query: QueryParameters) {
		const { page, limit, sortDirection, sortBy, searchLoginTerm, searchEmailTerm } = getPagination(query);
		const result = await this.usersQueryRepository.findUsers(
			page,
			limit,
			sortDirection,
			sortBy,
			searchLoginTerm,
			searchEmailTerm
		);
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async getUser(@Param('id') userId: string) {
		const result = await this.usersQueryRepository.findUserById(userId);
		if (result) return result;
		else return exceptionHandler(StatusCode.NotFound, userNotFound, userIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createUser(@Body() inputModel: UserInputDto) {
		const result = await this.commandBus.execute(new CreateUserCommand(inputModel));
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteUser(@Param('id') userId: string) {
		const result = await this.commandBus.execute(new DeleteUserCommand(userId));
		if (result) return;
		else return exceptionHandler(StatusCode.NotFound, userNotFound, userIdField);
	}
}
