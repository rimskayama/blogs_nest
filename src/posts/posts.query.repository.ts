import { PostType, PostViewDto, postsPaginationDto } from './posts.types';
import { likeDetails } from './post.entity';
import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../likes/likes.types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsQueryRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}

	async findPosts(
		page: number,
		limit: number,
		sortDirection: string,
		sortBy: string,
		skip: number,
		userId: string | false
	): Promise<postsPaginationDto> {
		let result;
		let count;
		const query = `
		SELECT p.*
		FROM public."Posts" p
		GROUP BY p."id"
		ORDER BY "${sortBy}" ${sortDirection === 'asc' ? 'ASC' : 'DESC'}
		LIMIT $1 OFFSET $2;`;

		const queryToCountTotal = `
		SELECT count(*) as total
		FROM public."Posts" p`;

		try {
			result = await this.dataSource.query(query, [limit, skip]);
			count = await this.dataSource.query(queryToCountTotal);
		} catch (error) {
			console.error('Error finding posts', error);
		}

		const total = parseInt(count[0].total);
		const pagesCount = Math.ceil(total / limit);

		const items = await Promise.all(
			result.map(async (post) => {
				let likeStatus = 'None';
				//status
				if (userId) {
					const query = `
					SELECT "status"
					FROM public."PostLikes" pl
					WHERE pl."postId" = $1 AND pl."userId" = $2
				`;
					try {
						const likeResult = await this.dataSource.query(query, [post.id, userId]);
						if (likeResult.length === 0) {
							likeStatus = 'None';
						} else likeStatus = likeResult[0].status;
					} catch (error) {
						console.error('Error finding post likes:', error);
					}
				}

				//get newestLikes
				let newestLikes: likeDetails[] = [];
				const queryToGetLikes = `
				SELECT "userId", "login", "addedAt"
				FROM public."PostLikes" pl
				WHERE pl."postId" = $1 AND pl."status" = $2
				ORDER BY "addedAt" DESC
				LIMIT $3 OFFSET $4;
				`;
				try {
					newestLikes = await this.dataSource.query(queryToGetLikes, [post.id, LikeStatus.Like, 3, 0]);
				} catch (error) {
					console.error('Error finding post likes:', error);
				}

				return PostType.getViewPost({
					...post,
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

	async findPostById(postId: string, userId: string | false): Promise<PostViewDto | null> {
		const query = `
        SELECT "id", "title", "shortDescription", "content", "blogId", "blogName", "createdAt", "likesCount", "dislikesCount"
		FROM public."Posts" p
		WHERE p."id" = $1
    `;
		try {
			const result = await this.dataSource.query(query, [postId]);
			if (result.length === 0) {
				return null;
			}
			//set like
			let likeStatus = 'None';
			if (userId) {
				const query = `
					SELECT "status"
					FROM public."PostLikes" pl
					WHERE pl."postId" = $1 AND pl."userId" = $2
				`;
				try {
					const likeResult = await this.dataSource.query(query, [postId, userId]);
					if (likeResult.length === 0) {
						likeStatus = 'None';
					} else likeStatus = likeResult[0].status;
				} catch (error) {
					console.error('Error finding post likes:', error);
				}
			}

			//get newestLikes
			let newestLikes: likeDetails[] = [];
			const queryToGetLikes = `
				SELECT "userId", "login", "addedAt"
				FROM public."PostLikes" pl
				WHERE pl."postId" = $1 AND pl."status" = $2
				ORDER BY "addedAt" DESC
				LIMIT $3 OFFSET $4;
				`;
			try {
				newestLikes = await this.dataSource.query(queryToGetLikes, [postId, LikeStatus.Like, 3, 0]);
			} catch (error) {
				console.error('Error finding post likes:', error);
			}

			return PostType.getViewPost({
				...result[0],
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
		SELECT p.*
		FROM public."Posts" p
		WHERE p."blogId" = $1
		ORDER BY "${sortBy}" ${sortDirection === 'asc' ? 'ASC' : 'DESC'}
		LIMIT $2 OFFSET $3;`;

		const queryToCountTotal = `
		SELECT count(*) as total
		FROM public."Posts" p
		WHERE p."blogId" = $1;`;

		try {
			result = await this.dataSource.query(query, [blogId, limit, skip]);
			count = await this.dataSource.query(queryToCountTotal, [blogId]);
		} catch (error) {
			console.error('Error finding posts', error);
		}

		const total = parseInt(count[0].total);
		const pagesCount = Math.ceil(total / limit);

		const items = await Promise.all(
			result.map(async (post) => {
				let likeStatus = 'None';
				//set like
				if (userId) {
					const query = `
					SELECT "status"
					FROM public."PostLikes" pl
					WHERE pl."postId" = $1 AND pl."userId" = $2
				`;
					try {
						const result = await this.dataSource.query(query, [post.id, userId]);
						likeStatus = result[0].status;
					} catch (error) {
						console.error('Error finding post likes:', error);
					}
				}

				//get newestLikes
				let newestLikes: likeDetails[] = [];
				const queryToGetLikes = `
				SELECT "userId", "login", "addedAt"
				FROM public."PostLikes" pl
				WHERE pl."postId" = $1 AND pl."status" = $2
				ORDER BY "addedAt" DESC
				LIMIT $3 OFFSET $4;
				`;
				try {
					newestLikes = await this.dataSource.query(queryToGetLikes, [post.id, LikeStatus.Like, 3, 0]);
				} catch (error) {
					console.error('Error finding post likes:', error);
				}

				return PostType.getViewPost({
					...post,
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

	async updatePostLikes(postId: string, likesCount: number, dislikesCount: number) {
		const query = `
		UPDATE public."Posts" p
		SET "likesCount"=$1, "dislikesCount"=$2
		WHERE p."id" = $3;
	`;
		try {
			await this.dataSource.query(query, [likesCount, dislikesCount, postId]);
			return true;
		} catch (error) {
			console.error('Error updating post likes:', error);
		}
	}
}
