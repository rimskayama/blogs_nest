import { CommentType, CommentViewDto } from '../comments.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
	constructor(@InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>) {}

	async createComment(comment: CommentType): Promise<CommentViewDto | null> {
		try {
			const result = await this.commentsRepository.save(comment);
			const userInfo = await this.commentsRepository
				.createQueryBuilder('c')
				.leftJoin('c.user', 'u')
				.select(['c.id', 'c.content', 'c.userId', 'c.createdAt', 'u.login'])
				.where(`c.userId = :id`, {
					id: comment.userId,
				})
				.getOne();

			const userLogin = userInfo.user.login;
			return Comment.getViewComment({
				...result,
				userLogin: userLogin,
			});
		} catch (error) {
			console.error('Error creating comment :', error);
			return null;
		}
	}

	async updateComment(id: string, content: string) {
		try {
			const comment = await this.commentsRepository
				.createQueryBuilder('b')
				.where('b.id = :blogId', {
					blogId: id,
				})
				.getOne();
			comment.content = content;
			await this.commentsRepository.save(comment);
			return true;
		} catch (error) {
			console.error('Error updating comment:', error);
			return false;
		}
	}

	async deleteComment(id: string): Promise<boolean> {
		try {
			const result = await this.commentsRepository
				.createQueryBuilder('c')
				.delete()
				.from(Comment)
				.where('id = :commentId', { commentId: id })
				.execute();
			return result.affected === 1;
		} catch (error) {
			console.error('Error deleting comment:', error);
			return false;
		}
	}
}
