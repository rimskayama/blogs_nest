import { UserDto, UsersPaginationDto } from '../users.types';
import { Injectable } from '@nestjs/common';
import { usersMapping } from '../../utils/mapping';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';

@Injectable()
export class UsersQueryRepository {
	constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

	async findUsers(
		pageNumber: number,
		pageSize: number,
		sortDirection: 'ASC' | 'DESC',
		sortBy: string,
		searchLoginTerm: string,
		searchEmailTerm: string
	): Promise<UsersPaginationDto> {
		const result = await this.usersRepository
			.createQueryBuilder('u')
			.where(
				`${
					searchLoginTerm || searchEmailTerm
						? `(u.login ilike :loginTerm OR u.email ilike :emailTerm)`
						: 'u.login is not null'
				}`,
				{
					loginTerm: `%${searchLoginTerm}%`,
					emailTerm: `%${searchEmailTerm}%`,
				}
			)
			.orderBy(`u.${sortBy}`, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.take(pageSize)
			.getMany();

		const count = await this.usersRepository
			.createQueryBuilder('u')
			.where(
				`${
					searchLoginTerm || searchEmailTerm
						? `(u.login ilike :loginTerm OR u.email ilike :emailTerm)`
						: 'u.login is not null'
				}`,
				{
					loginTerm: `%${searchLoginTerm}%`,
					emailTerm: `%${searchEmailTerm}%`,
				}
			)
			.orderBy(`u.${sortBy}`, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.take(pageSize)
			.getCount();

		const pagesCount = Math.ceil(count / pageSize);

		return {
			pagesCount: pagesCount,
			page: pageNumber,
			pageSize: pageSize,
			totalCount: count,
			items: usersMapping(result),
		};
	}

	async findUserById(id: string): Promise<UserDto | null> {
		try {
			const result = await this.usersRepository
				.createQueryBuilder('u')
				.select(['u.id', 'u.login', 'u.email', 'u.createdAt'])
				.where(`u.id = :userId`, {
					userId: id,
				})
				.getMany();
			return User.getViewUser(result[0]);
		} catch (error) {
			console.error('Error finding user:', error);
		}
	}
}
