import { BlogDto } from '../blogs.types';
import { blogsMapping } from '../../utils/mapping';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../domain/blog.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/utils/pagination.types';

@Injectable()
export class BlogsQueryRepository {
	constructor(@InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>) {}
	async findBlogs(
		pageNumber: number,
		pageSize: number,
		sortDirection: 'ASC' | 'DESC',
		sortBy: string,
		searchNameTerm: string
	): Promise<PaginationDto<BlogDto>> {
		const result = await this.blogsRepository
			.createQueryBuilder('b')
			.where(`${searchNameTerm ? `(b.name ilike :nameTerm)` : 'b.name is not null'}`, {
				nameTerm: `%${searchNameTerm}%`,
			})
			.orderBy(`b.${sortBy}`, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.take(pageSize)
			.getMany();

		const count = await this.blogsRepository
			.createQueryBuilder('b')
			.where(`${searchNameTerm ? `(b.name ilike :nameTerm)` : 'b.name is not null'}`, {
				nameTerm: `%${searchNameTerm}%`,
			})
			.orderBy(`b.${sortBy}`, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.take(pageSize)
			.getCount();

		const pagesCount = Math.ceil(count / pageSize);

		return {
			pagesCount: pagesCount,
			page: pageNumber,
			pageSize: pageSize,
			totalCount: count,
			items: blogsMapping(result),
		};
	}

	async findBlogById(blogId: string): Promise<BlogDto | null> {
		try {
			const result = await this.blogsRepository
				.createQueryBuilder('b')
				.select(['b.id', 'b.name', 'b.description', 'b.websiteUrl', 'b.isMembership', 'b.createdAt'])
				.where(`b.id = :blogId`, {
					blogId: blogId,
				})
				.getMany();
			return Blog.getViewBlog(result[0]);
		} catch (error) {
			console.error('Error finding blog:', error);
			return null;
		}
	}
}
