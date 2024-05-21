import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from './post-like.entity';
import { PostLikeType } from './likes.types';

@Injectable()
export class PostLikesRepository {
	constructor(@InjectRepository(PostLike) private readonly postLikesRepository: Repository<PostLike>) {}

	async setLikeStatus(newStatus: PostLikeType) {
		try {
			await this.postLikesRepository.save(newStatus);
			return true;
		} catch (error) {
			console.error('Error creating post like status :', error);
			return false;
		}
	}

	async checkLikeInDB(postId: string, userId: string) {
		try {
			const result = await this.postLikesRepository
				.createQueryBuilder('pl')
				.select(['pl.status'])
				.where(`pl.postId = :postId`, {
					postId: postId,
				})
				.andWhere(`pl.userId = :userId`, {
					userId: userId,
				})
				.getOne();
			return result;
		} catch (error) {
			console.error('Error finding post like status:', error);
			return null;
		}
	}

	async updateLikeStatus(likeStatus: string, postId: string, userId: string) {
		try {
			const like = await this.postLikesRepository
				.createQueryBuilder('pl')
				.where('pl.postId = :postId', {
					postId: postId,
				})
				.andWhere('pl.userId = :userId', {
					userId: userId,
				})
				.getOne();
			like.status = likeStatus;
			like.addedAt = new Date();
			await this.postLikesRepository.save(like);
			return;
		} catch (error) {
			console.error('Error updating post like status:', error);
		}
	}

	async removeLike(postId: string, userId: string) {
		try {
			const result = await this.postLikesRepository
				.createQueryBuilder('pl')
				.delete()
				.from(PostLike)
				.where('postId = :postId', { postId: postId })
				.andWhere('userId = :userId', { userId: userId })
				.execute();
			return result.affected === 1;
		} catch (error) {
			console.error('Error deleting post like status:', error);
			return null;
		}
	}
}
