import { UserType, UsersPaginationDto } from './users.types';
import { Injectable } from '@nestjs/common';
import { usersMapping } from '../utils/mapping';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersQueryRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}

	async findUsers(
		page: number,
		limit: number,
		sortDirection: string,
		sortBy: string,
		skip: number,
		searchLoginTerm: string,
		searchEmailTerm: string
	): Promise<UsersPaginationDto> {
		let result;
		const query = `
		SELECT u.*, count(*) as total
		FROM public."Users" u
		WHERE u."login" like $1
		OR not exists (SELECT u.* FROM public."Users" u WHERE u."login" like $1)
		AND u.email like $2
		OR not exists (SELECT u.* FROM public."Users" u WHERE u.email like $2)
		GROUP BY u."id"
		ORDER BY $3 ${sortDirection === 'asc' ? 'ASC' : 'DESC'}
		LIMIT $4 OFFSET $5;`;

		try {
			result = await this.dataSource.query(query, [searchLoginTerm, searchEmailTerm, sortBy, limit, skip]);
		} catch (error) {
			console.error('Error finding users', error);
		}

		const allUsers = usersMapping(result);
		const total = allUsers.length;
		const pagesCount = Math.ceil(total / limit);

		return {
			pagesCount: pagesCount,
			page: page,
			pageSize: limit,
			totalCount: total,
			items: usersMapping(result),
		};
	}

	async findUserById(id: string): Promise<UserType | null> {
		const query = `
        SELECT id, login, email, "createdAt"
		FROM public."Users" u
		WHERE u.id = $1
    `;

		try {
			const result = await this.dataSource.query(query, [id]);
			return result[0];
		} catch (error) {
			console.error('Error finding user:', error);
		}
	}
}
