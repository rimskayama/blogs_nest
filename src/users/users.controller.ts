import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.query.repository';
import { getPagination } from '../utils/pagination';
import { ObjectId } from 'mongodb';
import { UserInputDto, QueryParameters } from './users.types';
import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Query } from '@nestjs/common';
import { exceptionHandler } from '../exceptions/exception.handler';
import { StatusCode, userIdField, userNotFound } from '../exceptions/exception.constants';

@Controller('users')
export class UsersController {
	constructor(
		@Inject(UsersService) protected usersService: UsersService,
		@Inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
	) {}

	@Get()
	@HttpCode(200)
	async getUsers(@Query() query: QueryParameters) {
		const { page, limit, sortDirection, sortByUsers, searchLoginTerm, searchEmailTerm, skip } = getPagination(query);
		const result = await this.usersQueryRepository.findUsers(
			page,
			limit,
			sortDirection,
			sortByUsers,
			skip,
			searchLoginTerm,
			searchEmailTerm
		);
		return result;
	}

	@Get(':id')
	@HttpCode(200)
	async getUser(@Param('id') userId: string) {
		const result = await this.usersQueryRepository.findUserById(new ObjectId(userId));
		if (result) return result;
		else return exceptionHandler(StatusCode.NotFound, userNotFound, userIdField);
	}

	@Post()
	@HttpCode(201)
	async createUser(@Body() inputModel: UserInputDto) {
		const result = await this.usersService.createUser(inputModel);
		return result;
	}

	@Delete(':id')
	@HttpCode(204)
	async deleteUser(@Param('id') userId: string) {
		const result = await this.usersService.deleteUser(userId);
		if (result) return;
		else return exceptionHandler(StatusCode.NotFound, userNotFound, userIdField);
	}
}
