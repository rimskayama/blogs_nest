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
		let count;
		const query = `
		SELECT u.*
		FROM public."Users" u
		WHERE u."login" ILIKE '%' || $1 || '%' 
		OR u."email" ILIKE '%' || $2 || '%'
		GROUP BY u."id"
		ORDER BY "${sortBy}" ${sortDirection === 'asc' ? 'ASC' : 'DESC'}
		LIMIT $3 OFFSET $4;`;

		const queryToCountTotal = `
		SELECT count(*) as total
		FROM public."Users" u
		WHERE u."login" ILIKE '%' || $1 || '%' 
		OR u."email" ILIKE '%' || $2 || '%';`;

		try {
			result = await this.dataSource.query(query, [searchLoginTerm, searchEmailTerm, limit, skip]);
			count = await this.dataSource.query(queryToCountTotal, [searchLoginTerm, searchEmailTerm]);
		} catch (error) {
			console.error('Error finding users', error);
		}

		const total = parseInt(count[0].total);
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
		WHERE u.id = $1;
    `;

		try {
			const result = await this.dataSource.query(query, [id]);
			return result[0];
		} catch (error) {
			console.error('Error finding user:', error);
		}
	}
}
