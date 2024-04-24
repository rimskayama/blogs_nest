import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentLikeType, LikeStatus } from './likes.types';

@Injectable()
export class CommentLikesRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}
	async countLikes(commentId: string) {
		let likes;
		let dislikes;
		const queryToCountLikes = `
		SELECT count(*) as total
		FROM public."CommentLikes" cl
		WHERE cl."commentId" = $1 AND cl."status" = $2;`;

		try {
			likes = await this.dataSource.query(queryToCountLikes, [commentId, LikeStatus.Like]);
			dislikes = await this.dataSource.query(queryToCountLikes, [commentId, LikeStatus.Dislike]);
		} catch (error) {
			console.error('Error counting comment likes', error);
		}

		const likesCount = parseInt(likes[0].total);
		const dislikesCount = parseInt(dislikes[0].total);

		return {
			likesCount: likesCount,
			dislikesCount: dislikesCount,
		};
	}

	async setLikeStatus(newStatus: CommentLikeType) {
		const query = `INSERT INTO public."CommentLikes"(
				"id", "commentId", "status", "userId", "login", "addedAt")
			VALUES($1, $2, $3, $4, $5, $6)
			RETURNING *
			`;

		const values = [
			newStatus.id,
			newStatus.commentId,
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
			console.error('Error creating comment like status :', error);
			return false;
		}
	}

	async checkLikeInDB(commentId: string, userId: string) {
		const query = `
        SELECT "status"
		FROM public."CommentLikes" cl
		WHERE cl."commentId" = $1 AND cl."userId" = $2;
    `;

		try {
			const result = await this.dataSource.query(query, [commentId, userId]);
			return result[0];
		} catch (error) {
			console.error('Error finding comment like status:', error);
			return null;
		}
	}

	async updateLikeStatus(likeStatus: string, commentId: string, userId: string) {
		const query = `
			UPDATE public."CommentLikes" cl
			SET "status"=$1, "addedAt"=$2
			WHERE cl."commentId" = $3 AND cl."userId" = $4;
		`;
		const values = [likeStatus, new Date(), commentId, userId];

		try {
			return await this.dataSource.query(query, values);
		} catch (error) {
			console.error('Error updating comment like status:', error);
		}
	}

	async removeLike(commentId: string, userId: string) {
		const query = `
		DELETE FROM public."CommentLikes" cl
        WHERE cl."commentId" = $1 AND cl."userId" = $2;
	`;
		try {
			const result = await this.dataSource.query(query, [commentId, userId]);
			if (result[1] === 0) {
				return null;
			}
			return true;
		} catch (error) {
			console.error('Error deleting comment like status:', error);
			return null;
		}
	}
}
