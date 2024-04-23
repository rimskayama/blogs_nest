import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeStatus, PostLikeType } from './likes.types';

@Injectable()
export class PostLikesRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}

	async countLikes(postId: string) {
		let likes;
		let dislikes;
		const queryToCountLikes = `
		SELECT count(*) as total
		FROM public."PostLikes" pl
		WHERE pl."postId" = $1 AND pl."status" = $2;`;

		try {
			likes = await this.dataSource.query(queryToCountLikes, [postId, LikeStatus.Like]);
			dislikes = await this.dataSource.query(queryToCountLikes, [postId, LikeStatus.Dislike]);
		} catch (error) {
			console.error('Error counting post likes', error);
		}

		const likesCount = parseInt(likes[0].total);
		const dislikesCount = parseInt(dislikes[0].total);

		return {
			likesCount: likesCount,
			dislikesCount: dislikesCount,
		};
	}

	async setLikeStatus(newStatus: PostLikeType) {
		const query = `INSERT INTO public."PostLikes"(
				"id", "postId", "status", "userId", "login", "addedAt")
			VALUES($1, $2, $3, $4, $5, $6)
			RETURNING *
			`;

		const values = [
			newStatus.id,
			newStatus.postId,
			newStatus.status,
			newStatus.userId,
			newStatus.login,
			newStatus.addedAt,
		];

		try {
			const result = await this.dataSource.query(query, values);
			if (result[1] === 0) {
				return false;
			}
			return true;
		} catch (error) {
			console.error('Error creating post like status :', error);
			return false;
		}
	}

	async checkLikeInDB(postId: string, userId: string) {
		const query = `
        SELECT "status"
		FROM public."PostLikes" pl
		WHERE pl."postId" = $1 AND pl."userId" = $2;
    `;

		try {
			const result = await this.dataSource.query(query, [postId, userId]);
			return result[0];
		} catch (error) {
			console.error('Error finding post like:', error);
			return null;
		}
	}

	async updateLikeStatus(likeStatus: string, postId: string, userId: string) {
		const query = `
			UPDATE public."PostLikes" pl
			SET "status"=$1, "addedAt"=$2
			WHERE pl."postId" = $3 AND pl."userId" = $4;
		`;
		const values = [likeStatus, new Date(), postId, userId];

		try {
			return await this.dataSource.query(query, values);
		} catch (error) {
			console.error('Error updating post like status:', error);
		}
	}

	async removeLike(postId: string, userId: string) {
		const query = `
		DELETE FROM public."PostLikes" pl
        WHERE pl."postId" = $1 AND pl."userId" = $2;
	`;
		try {
			const result = await this.dataSource.query(query, [postId, userId]);
			if (result[1] === 0) {
				return null;
			}
			return true;
		} catch (error) {
			console.error('Error deleting post like status:', error);
			return null;
		}
	}
}
