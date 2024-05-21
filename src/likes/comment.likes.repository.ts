import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentLikeType } from './likes.types';
import { CommentLike } from './comment-like.entity';

@Injectable()
export class CommentLikesRepository {
	constructor(@InjectRepository(CommentLike) private readonly commentLikesRepository: Repository<CommentLike>) {}

	async setLikeStatus(newStatus: CommentLikeType) {
		try {
			await this.commentLikesRepository.save(newStatus);
			return true;
		} catch (error) {
			console.error('Error creating comment like status :', error);
			return false;
		}
	}

	async checkLikeInDB(commentId: string, userId: string) {
		try {
			const result = await this.commentLikesRepository
				.createQueryBuilder('cl')
				.select(['cl.status'])
				.where(`cl.commentId = :commentId`, {
					commentId: commentId,
				})
				.andWhere(`cl.userId = :userId`, {
					userId: userId,
				})
				.getOne();
			return result;
		} catch (error) {
			console.error('Error finding comment like status:', error);
			return null;
		}
	}

	async updateLikeStatus(likeStatus: string, commentId: string, userId: string) {
		try {
			const like = await this.commentLikesRepository
				.createQueryBuilder('cl')
				.where('cl.commentId = :commentId', {
					commentId: commentId,
				})
				.andWhere('cl.userId = :userId', {
					userId: userId,
				})
				.getOne();
			like.status = likeStatus;
			like.addedAt = new Date();
			await this.commentLikesRepository.save(like);
			return;
		} catch (error) {
			console.error('Error updating comment like status:', error);
		}
	}

	async removeLike(commentId: string, userId: string) {
		try {
			const result = await this.commentLikesRepository
				.createQueryBuilder('cl')
				.delete()
				.from(CommentLike)
				.where('commentId = :commentId', { commentId: commentId })
				.andWhere('userId = :userId', { userId: userId })
				.execute();
			return result.affected === 1;
		} catch (error) {
			console.error('Error deleting comment like status:', error);
			return null;
		}
	}
}
