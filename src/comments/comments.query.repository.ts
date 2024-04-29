import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentType, CommentViewDto } from './comments.types';
import { likeDetails } from '../posts/post.entity';
import { LikeStatus } from '../likes/likes.types';

@Injectable()
export class CommentsQueryRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}
	async findCommentsByPostId(
		postId: string,
		page: number,
		limit: number,
		sortDirection: string,
		sortBy: string,
		skip: number,
		userId: string | false
	) {
		let result;
		let count;
		const query = `
		SELECT c.*
		FROM public."Comments" c
		WHERE c."postId" ILIKE '%' || $1 || '%'
		GROUP BY c."id"
		ORDER BY "${sortBy}" ${sortDirection === 'asc' ? 'ASC' : 'DESC'}
		LIMIT $2 OFFSET $3;`;

		const queryToCountTotal = `
		SELECT count(*) as total
		FROM public."Comments" c
		WHERE c."postId" ILIKE '%' || $1 || '%' ;`;

		try {
			result = await this.dataSource.query(query, [postId, limit, skip]);
			count = await this.dataSource.query(queryToCountTotal, [postId]);
		} catch (error) {
			console.error('Error finding comments by postId', error);
		}

		const total = parseInt(count[0].total);
		const pagesCount = Math.ceil(total / limit);

		const items = await Promise.all(
			result.map(async (comment) => {
				let likeStatus = 'None';
				//set like
				if (userId) {
					const query = `
					SELECT "status"
					FROM public."CommentLikes" cl
					WHERE cl."commentId" = $1 AND cl."userId" = $2
				`;
					try {
						const result = await this.dataSource.query(query, [comment.id, userId]);
						likeStatus = result[0].status;
					} catch (error) {
						console.error('Error finding comment likes:', error);
					}
				}

				//get newestLikes
				let newestLikes: likeDetails[] = [];
				const queryToGetLikes = `
				SELECT "userId", "login", "addedAt"
				FROM public."CommentLikes" cl
				WHERE cl."commentId" = $1 AND cl."status" = $2
				ORDER BY "addedAt" DESC
				LIMIT $3 OFFSET $4;
				`;
				try {
					newestLikes = await this.dataSource.query(queryToGetLikes, [comment.id, LikeStatus.Like, 3, 0]);
				} catch (error) {
					console.error('Error finding comment likes:', error);
				}

				return CommentType.getViewComment({
					...comment,
					myStatus: likeStatus,
					newestLikes,
				});
			})
		);
		return {
			pagesCount: pagesCount,
			page: page,
			pageSize: limit,
			totalCount: total,
			items,
		};
	}

	async findCommentById(commentId: string, userId: string | false): Promise<CommentViewDto | null> {
		const query = `
		SELECT "id", "content", "createdAt", "commentatorId", "commentatorLogin", "likesCount", "dislikesCount"
		FROM public."Comments" c
		WHERE c."id" = $1;
	`;
		try {
			const result = await this.dataSource.query(query, [commentId]);
			if (result.length === 0) {
				return null;
			}
			//set like
			let likeStatus = 'None';
			if (userId) {
				const query = `
				SELECT "status"
				FROM public."CommentLikes" cl
				WHERE cl."commentId" = $1 AND cl."userId" = $2
			`;
				try {
					const likeResult = await this.dataSource.query(query, [commentId, userId]);
					if (likeResult.length === 0) {
						likeStatus = 'None';
					} else likeStatus = likeResult[0].status;
				} catch (error) {
					console.error('Error finding comment likes:', error);
				}
			}
			return CommentType.getViewComment({
				...result[0],
				myStatus: likeStatus,
			});
		} catch (error) {
			console.error('Error finding comment:', error);
			return null;
		}
	}
}
