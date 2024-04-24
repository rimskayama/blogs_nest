import { UsersQueryRepository } from '../users/users.query.repository';
import { PostLikesRepository } from './post.likes.repository';
import { Inject, Injectable } from '@nestjs/common';
import { CommentViewDto } from '../comments/comments.types';
import { CommentLikesRepository } from './comment.likes.repository';
import { PostViewDto } from '../posts/posts.types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LikesService {
	constructor(
		@Inject(PostLikesRepository) protected postLikesRepository: PostLikesRepository,
		@Inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
		@Inject(CommentLikesRepository) protected commentLikesRepository: CommentLikesRepository
	) {}

	//COMMENT LIKES

	async setCommentLikeStatus(likeStatus: string, comment: CommentViewDto, userId: string) {
		const user = await this.usersQueryRepository.findUserById(userId);
		const like = {
			id: uuidv4(),
			commentId: comment.id,
			status: likeStatus,
			userId: userId,
			login: user!.login,
			addedAt: new Date(),
		};
		return await this.commentLikesRepository.setLikeStatus(like);
	}

	async checkCommentLikeStatus(likeStatus: string, commentId: string, userId: string) {
		if (likeStatus === 'None') {
			await this.commentLikesRepository.removeLike(commentId, userId);
			return true;
		} else {
			//Like or Dislike
			const likeInDB = await this.commentLikesRepository.checkLikeInDB(commentId, userId);
			if (!likeInDB) return false; // can be created
			if (likeInDB) {
				if (likeInDB.status === likeStatus) return true;
				if (likeInDB.status !== likeStatus) {
					await this.commentLikesRepository.updateLikeStatus(likeStatus, commentId, userId);
					return true;
				}
			}
		}
	}

	async countCommentLikes(commentId: string) {
		return await this.commentLikesRepository.countLikes(commentId);
	}

	// POST LIKES

	async setPostLikeStatus(likeStatus: string, post: PostViewDto, userId: string) {
		const user = await this.usersQueryRepository.findUserById(userId);
		const like = {
			id: uuidv4(),
			postId: post.id,
			status: likeStatus,
			userId: userId,
			login: user.login,
			addedAt: new Date(),
		};
		return await this.postLikesRepository.setLikeStatus(like);
	}

	async checkPostLikeStatus(likeStatus: string, postId: string, userId: string) {
		if (likeStatus === 'None') {
			await this.postLikesRepository.removeLike(postId, userId);
			return true;
		} else {
			//Like or Dislike
			const likeInDB = await this.postLikesRepository.checkLikeInDB(postId, userId);
			if (!likeInDB) return false; // can be created
			if (likeInDB) {
				if (likeInDB.status === likeStatus) return true;
				if (likeInDB.status !== likeStatus) {
					await this.postLikesRepository.updateLikeStatus(likeStatus, postId, userId);
					return true;
				}
			}
		}
	}
	async countPostLikes(postId: string) {
		return await this.postLikesRepository.countLikes(postId);
	}
}
