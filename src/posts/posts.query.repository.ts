import { PostViewDto, postsPaginationDto } from './posts.types';
import { Post } from './post.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from '../likes/post-like.entity';
import { LikeStatus } from '../likes/likes.types';

@Injectable()
export class PostsQueryRepository {
	constructor(
		@InjectRepository(Post) private readonly postsRepository: Repository<Post>,
		@InjectRepository(PostLike) private readonly postLikesRepository: Repository<PostLike>
	) {}

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
				let likeInfo;
				let likeStatus = 'None';
				let likesCount = 0;
				let dislikesCount = 0;
				let newestLikes = [];
				const blogName = post.blog.name;

				//set like
				if (userId) {
					likeInfo = await this.postLikesRepository
						.createQueryBuilder('pl')
						.select(['pl.id', 'pl.postId', 'pl.status', 'pl.userId'])
						.where(`pl.postId = :postId`, {
							postId: post.id,
						})
						.andWhere(`pl.userId = :userId`, {
							userId: userId,
						})
						.getOne();
					if (likeInfo) {
						likeStatus = likeInfo.status;
					}
				}
				likesCount = await this.postLikesRepository
					.createQueryBuilder('pl')
					.where(`pl.postId = :id`, {
						id: post.id,
					})
					.andWhere(`pl.status = :status`, {
						status: LikeStatus.Like,
					})
					.getCount();

				dislikesCount = await this.postLikesRepository
					.createQueryBuilder('pl')
					.where(`pl.postId = :id`, {
						id: post.id,
					})
					.andWhere(`pl.status = :status`, {
						status: LikeStatus.Dislike,
					})
					.getCount();

				newestLikes = await this.postLikesRepository
					.createQueryBuilder('pl')
					.leftJoin('pl.user', 'u')
					.select(['pl.id', 'pl.addedAt', 'pl.userId', 'u.login'])
					.where(`pl.postId = :postId`, {
						postId: post.id,
					})
					.andWhere(`pl.status = :status`, {
						status: LikeStatus.Like,
					})
					.orderBy(`pl.addedAt`, 'DESC')
					.skip(0)
					.take(3)
					.getMany();

				return Post.getViewPost({
					...post,
					blogName,
					likesCount,
					dislikesCount,
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
		let result;
		let blogName;
		try {
			result = await this.postsRepository
				.createQueryBuilder('p')
				.leftJoin('p.blog', 'b')
				.select(['p.id', 'p.title', 'p.shortDescription', 'p.content', 'p.blogId', 'p.createdAt', 'b.name'])
				.where(`p.id = :postId`, {
					postId: postId,
				})
				.getOne();
			blogName = result.blog.name;
		} catch (error) {
			console.error('Error finding post:', error);
			return null;
		}

		let likeInfo;
		let likeStatus = 'None';
		let likesCount = 0;
		let dislikesCount = 0;
		let newestLikes = [];

		//set like
		if (userId) {
			likeInfo = await this.postLikesRepository
				.createQueryBuilder('pl')
				.select(['pl.id', 'pl.postId', 'pl.status', 'pl.userId'])
				.where(`pl.postId = :postId`, {
					postId: result.id,
				})
				.andWhere(`pl.userId = :userId`, {
					userId: userId,
				})
				.getOne();
			if (likeInfo) {
				likeStatus = likeInfo.status;
			}
		}

		likesCount = await this.postLikesRepository
			.createQueryBuilder('pl')
			.where(`pl.postId = :postId`, {
				postId: result.id,
			})
			.andWhere(`pl.status = :status`, {
				status: LikeStatus.Like,
			})
			.getCount();

		dislikesCount = await this.postLikesRepository
			.createQueryBuilder('pl')
			.where(`pl.postId = :postId`, {
				postId: result.id,
			})
			.andWhere(`pl.status = :status`, {
				status: LikeStatus.Dislike,
			})
			.getCount();

		newestLikes = await this.postLikesRepository
			.createQueryBuilder('pl')
			.leftJoin('pl.user', 'u')
			.select(['pl.id', 'pl.addedAt', 'pl.userId', 'u.login'])
			.where(`pl.postId = :postId`, {
				postId: result.id,
			})
			.andWhere(`pl.status = :status`, {
				status: LikeStatus.Like,
			})
			.orderBy(`pl.addedAt`, 'DESC')
			.skip(0)
			.take(3)
			.getMany();

		return Post.getViewPost({
			...result,
			blogName,
			likesCount,
			dislikesCount,
			myStatus: likeStatus,
			newestLikes,
		});
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
			.where(`p.blogId = :blogId`, {
				blogId: blogId,
			})
			.orderBy(`p.${sortBy}`, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.take(pageSize)
			.getCount();

		const pagesCount = Math.ceil(count / pageSize);

		const items = await Promise.all(
			result.map(async (post) => {
				let likeInfo;
				let likeStatus = 'None';
				let likesCount = 0;
				let dislikesCount = 0;
				const blogName = post.blog.name;
				let newestLikes = [];

				//set like
				if (userId) {
					likeInfo = await this.postLikesRepository
						.createQueryBuilder('pl')
						.select(['pl.id', 'pl.postId', 'pl.status', 'pl.userId'])
						.where(`pl.postId = :postId`, {
							postId: post.id,
						})
						.andWhere(`pl.userId = :userId`, {
							userId: userId,
						})
						.getOne();
					if (likeInfo) {
						likeStatus = likeInfo.status;
					}
				}
				likesCount = await this.postLikesRepository
					.createQueryBuilder('pl')
					.where(`pl.postId = :id`, {
						id: post.id,
					})
					.andWhere(`pl.status = :status`, {
						status: LikeStatus.Like,
					})
					.getCount();

				dislikesCount = await this.postLikesRepository
					.createQueryBuilder('pl')
					.where(`pl.postId = :id`, {
						id: post.id,
					})
					.andWhere(`pl.status = :status`, {
						status: LikeStatus.Dislike,
					})
					.getCount();

				newestLikes = await this.postLikesRepository
					.createQueryBuilder('pl')
					.leftJoin('pl.user', 'u')
					.select(['pl.id', 'pl.addedAt', 'pl.userId', 'u.login'])
					.where(`pl.postId = :id`, {
						id: post.id,
					})
					.andWhere(`pl.status = :status`, {
						status: LikeStatus.Like,
					})
					.orderBy(`pl.addedAt`, 'DESC')
					.skip(0)
					.take(3)
					.getMany();

				return Post.getViewPost({
					...post,
					blogName,
					likesCount,
					dislikesCount,
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
