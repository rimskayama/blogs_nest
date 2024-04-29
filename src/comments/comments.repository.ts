import { commentDto, CommentViewDto } from './comments.types';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { commentsMapping } from '../utils/mapping';

@Injectable()
export class CommentsRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}

	async createComment(comment: commentDto): Promise<CommentViewDto | null> {
		const query = `INSERT INTO public."Comments"(
			"id", "postId", "content", "createdAt", "commentatorId", "commentatorLogin", "likesCount", "dislikesCount")
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `;

		const values = [
			comment.id,
			comment.postId,
			comment.content,
			comment.createdAt,
			comment.commentatorId,
			comment.commentatorLogin,
			comment.likesCount,
			comment.dislikesCount,
		];

		try {
			const result = await this.dataSource.query(query, values);
			return commentsMapping(result)[0];
		} catch (error) {
			console.error('Error creating comment :', error);
			return null;
		}
	}

	async updateComment(id: string, content: string) {
		const query = `
		UPDATE public."Comments" c
		SET "content"=$1
		WHERE c."id" = $2;
    `;
		try {
			const result = await this.dataSource.query(query, [content, id]);
			return result;
		} catch (error) {
			console.error('Error updating comment:', error);
			return false;
		}
	}

	async deleteComment(id: string): Promise<true | null> {
		const query = `
		DELETE FROM public."Comments" c
		WHERE c."id" = $1;
	`;

		try {
			const result = await this.dataSource.query(query, [id]);
			if (result[1] === 0) {
				return null;
			}
			return true;
		} catch (error) {
			console.error('Error deleting comment:', error);
			return null;
		}
	}
}
