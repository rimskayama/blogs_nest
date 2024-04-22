import { BlogDto } from './blogs.types';
import { blogsMapping } from '../utils/mapping';
import { BlogsPaginationDto } from './blogs.types';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}
	async findBlogs(
		page: number,
		limit: number,
		sortDirection: string,
		sortBy: string,
		searchNameTerm: string,
		skip: number
	): Promise<BlogsPaginationDto> {
		let result;
		let count;
		const query = `
		SELECT b.*
		FROM public."Blogs" b
		WHERE b."name" ILIKE '%' || $1 || '%' 
		GROUP BY b."id"
		ORDER BY "${sortBy}" ${sortDirection === 'asc' ? 'ASC' : 'DESC'}
		LIMIT $2 OFFSET $3;`;

		const queryToCountTotal = `
		SELECT count(*) as total
		FROM public."Blogs" b
		WHERE b."name" ILIKE '%' || $1 || '%';`;

		try {
			result = await this.dataSource.query(query, [searchNameTerm, limit, skip]);
			count = await this.dataSource.query(queryToCountTotal, [searchNameTerm]);
		} catch (error) {
			console.error('Error finding blogs', error);
		}

		const total = parseInt(count[0].total);
		const pagesCount = Math.ceil(total / limit);

		return {
			pagesCount: pagesCount,
			page: page,
			pageSize: limit,
			totalCount: total,
			items: blogsMapping(result),
		};
	}

	async findBlogById(blogId: string): Promise<BlogDto | null> {
		const query = `
        SELECT "id", "name", "description", "websiteUrl", "isMembership", "createdAt"
		FROM public."Blogs" b
		WHERE b."id" = $1;
    `;

		try {
			const result = await this.dataSource.query(query, [blogId]);
			return result[0];
		} catch (error) {
			console.error('Error finding blog:', error);
			return null;
		}
	}
}
