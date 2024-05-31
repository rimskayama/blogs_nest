import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentViewDto } from '../comments.types';
import { LikeStatus } from '../../likes/likes.types';
import { Comment } from '../domain/comment.entity';
import { CommentLike } from '../../likes/comment-like.entity';
import { PaginationDto } from 'src/utils/pagination.types';

@Injectable()
export class CommentsQueryRepository {
	constructor(
		@InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
		@InjectRepository(CommentLike) private readonly commentLikesRepository: Repository<CommentLike>
	) {}
	async findCommentsByPostId(
		postId: string,
		pageNumber: number,
		pageSize: number,
		sortDirection: 'ASC' | 'DESC',
		sortBy: string,
		userId: string | false
	): Promise<PaginationDto<CommentViewDto>> {
		const result = await this.commentsRepository
			.createQueryBuilder('c')
			.leftJoin('c.user', 'u')
			.select(['c.id', 'c.content', 'c.userId', 'c.createdAt', 'u.login'])
			.where(`c.postId = :id`, {
				id: postId,
			})
			.orderBy(`c.${sortBy}`, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.take(pageSize)
			.getMany();

		const count = await this.commentsRepository
			.createQueryBuilder('c')
			.where(`c.postId = :id`, {
				id: postId,
			})
			.orderBy(`c.${sortBy}`, sortDirection)
			.skip((pageNumber - 1) * pageSize)
			.take(pageSize)
			.getCount();

		const pagesCount = Math.ceil(count / pageSize);

		const items = await Promise.all(
			result.map(async (comment) => {
				let likeInfo;
				let likeStatus = 'None';
				let likesCount = 0;
				let dislikesCount = 0;
				const userLogin = comment.user.login;
				//set like
				if (userId) {
					likeInfo = await this.commentLikesRepository
						.createQueryBuilder('cl')
						.select(['cl.id', 'cl.commentId', 'cl.status', 'cl.userId'])
						.where(`cl.commentId = :commentId`, {
							commentId: comment.id,
						})
						.andWhere(`cl.userId = :userId`, {
							userId: userId,
						})
						.getOne();
					if (likeInfo) {
						likeStatus = likeInfo.status;
					}
				}
				likesCount = await this.commentLikesRepository
					.createQueryBuilder('cl')
					.where(`cl.commentId = :id`, {
						id: comment.id,
					})
					.andWhere(`cl.status = :status`, {
						status: LikeStatus.Like,
					})
					.getCount();

				dislikesCount = await this.commentLikesRepository
					.createQueryBuilder('cl')
					.where(`cl.commentId = :id`, {
						id: comment.id,
					})
					.andWhere(`cl.status = :status`, {
						status: LikeStatus.Dislike,
					})
					.getCount();

				return Comment.getViewComment({
					...comment,
					myStatus: likeStatus,
					userLogin: userLogin,
					likesCount,
					dislikesCount,
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

	async findCommentById(commentId: string, userId: string | false): Promise<CommentViewDto | null> {
		let result;
		let userLogin;
		try {
			result = await this.commentsRepository
				.createQueryBuilder('c')
				.leftJoin('c.user', 'u')
				.select(['c.id', 'c.content', 'c.userId', 'c.createdAt', 'u.login'])
				.where(`c.id = :id`, {
					id: commentId,
				})
				.getOne();
			userLogin = result.user.login;
		} catch (error) {
			console.error('Error finding comment:', error);
			return null;
		}

		//set like
		let likeStatus = 'None';
		let likesCount = 0;
		let dislikesCount = 0;
		if (userId) {
			const likeInfo = await this.commentLikesRepository
				.createQueryBuilder('cl')
				.select(['cl.id', 'cl.userId', 'cl.status', 'cl.commentId'])
				.where(`cl.commentId = :commentId`, {
					commentId: commentId,
				})
				.andWhere(`cl.userId = :userId`, {
					userId: userId,
				})
				.getOne();
			if (likeInfo) {
				likeStatus = likeInfo.status;
			}
		}

		likesCount = await this.commentLikesRepository
			.createQueryBuilder('cl')
			.where(`cl.commentId = :id`, {
				id: commentId,
			})
			.andWhere(`cl.status = :status`, {
				status: LikeStatus.Like,
			})
			.getCount();

		dislikesCount = await this.commentLikesRepository
			.createQueryBuilder('cl')
			.where(`cl.commentId = :id`, {
				id: commentId,
			})
			.andWhere(`cl.status = :status`, {
				status: LikeStatus.Dislike,
			})
			.getCount();

		return Comment.getViewComment({
			...result,
			userLogin: userLogin,
			myStatus: likeStatus,
			likesCount,
			dislikesCount,
		});
	}
}
