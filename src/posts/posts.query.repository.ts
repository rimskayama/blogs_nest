import { PostViewDto, postsPaginationDto } from './posts.types';
import { Post, likeDetails } from './post.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsQueryRepository {
	constructor(@InjectRepository(Post) private readonly postsRepository: Repository<Post>) {}

	async findPosts(
		pageNumber: number,
		pageSize: number,
		sortDirection: 'ASC' | 'DESC',
		sortBy: string,
		userId: string | false
	): Promise<postsPaginationDto> {
		const result = await this.postsRepository
			.createQueryBuilder('p')
			.leftJoin('p.blog', 'b')
			.select(['p.id', 'p.title', 'p.shortDescription', 'p.content', 'p.blogId', 'p.createdAt', 'b.name'])
			.orderBy(`${sortBy === 'blogName' ? 'b.name' : `p.${sortBy}`}`, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.take(pageSize)
			.getMany();

		const count = await this.postsRepository
			.createQueryBuilder('p')
			.orderBy(`p.${sortBy}`, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.take(pageSize)
			.getCount();

		const pagesCount = Math.ceil(count / pageSize);

		const items = await Promise.all(
			result.map(async (post) => {
				const likeStatus = 'None';
				let newestLikes: [];
				const blogName = post.blog.name;

				return Post.getViewPost({
					...post,
					blogName,
					likesCount: 0,
					dislikesCount: 0,
					myStatus: likeStatus,
					newestLikes,
				});
			})
		);
		return {
			pagesCount: pagesCount,
			page: pageNumber,
			pageSize: pageSize,
			totalCount: count,
			items,
		};
	}

	async findPostById(postId: string, userId: string | false): Promise<PostViewDto | null> {
		try {
			const result = await this.postsRepository
				.createQueryBuilder('p')
				.leftJoin('p.blog', 'b')
				.select(['p.id', 'p.title', 'p.shortDescription', 'p.content', 'p.blogId', 'p.createdAt', 'b.name'])
				.where(`p.id = :postId`, {
					postId: postId,
				})
				.getOne();

			const likeStatus = 'None';
			let newestLikes: [];
			const blogName = result.blog.name;

			return Post.getViewPost({
				...result,
				blogName,
				likesCount: 0,
				dislikesCount: 0,
				myStatus: likeStatus,
				newestLikes,
			});
		} catch (error) {
			console.error('Error finding post:', error);
			return null;
		}
	}

	async findPostsByBlogId(
		blogId: string,
		pageNumber: number,
		pageSize: number,
		sortDirection: 'ASC' | 'DESC',
		sortBy: string,
		userId: string | false
	) {
		const result = await this.postsRepository
			.createQueryBuilder('p')
			.leftJoin('p.blog', 'b')
			.select(['p.id', 'p.title', 'p.shortDescription', 'p.content', 'p.blogId', 'p.createdAt', 'b.name'])
			.where(`p.blogId = :blogId`, {
				blogId: blogId,
			})
			.orderBy(`p.${sortBy}`, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.take(pageSize)
			.getMany();

		const count = await this.postsRepository
			.createQueryBuilder('p')
			.orderBy(`p.${sortBy}`, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.take(pageSize)
			.getCount();

		const pagesCount = Math.ceil(count / pageSize);

		const items = await Promise.all(
			result.map(async (post) => {
				const likeStatus = 'None';
				const blogName = post.blog.name;
				const newestLikes: likeDetails[] = [];

				return Post.getViewPost({
					...post,
					blogName,
					likesCount: 0,
					dislikesCount: 0,
					myStatus: likeStatus,
					newestLikes,
				});
			})
		);
		return {
			pagesCount: pagesCount,
			page: pageNumber,
			pageSize: pageSize,
			totalCount: count,
			items,
		};
	}
}
