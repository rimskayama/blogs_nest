import { ObjectId } from 'mongodb';
import { UsersQueryRepository } from '../users/users.query.repository';
import { PostLikesRepository } from './post.likes.repository';
import { Inject, Injectable } from '@nestjs/common';
import { commentDto } from '../comments/comments.types';
import { CommentLikesRepository } from './comment.likes.repository';
import { PostDto } from '../posts/posts.types';

@Injectable()
export class LikesService {
	constructor(
		@Inject(PostLikesRepository) protected postLikesRepository: PostLikesRepository,
		@Inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
		@Inject(CommentLikesRepository) protected commentLikesRepository: CommentLikesRepository
	) {}

	//COMMENT LIKES

	async setCommentLikeStatus(likeStatus: string, comment: commentDto, userId: string) {
		const user = await this.usersQueryRepository.findUserById(new ObjectId(userId));
		const like = {
			_id: new ObjectId(),
			commentId: comment.id,
			status: likeStatus,
			userId: userId,
			login: user!.login,
			addedAt: new Date().toISOString(),
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

	async setPostLikeStatus(likeStatus: string, post: PostDto, userId: string) {
		const user = await this.usersQueryRepository.findUserById(new ObjectId(userId));
		const description = 'Details about single like';
		const like = {
			_id: new ObjectId(),
			postId: post.id,
			status: likeStatus,
			userId: userId,
			login: user.login,
			description: description,
			addedAt: new Date().toISOString(),
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
