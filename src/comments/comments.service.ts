import { ObjectId } from 'mongodb';
import { UsersQueryRepository } from '../users/users.query.repository';
import { CommentsRepository } from './comments.repository';
import { CommentsQueryRepository } from './comments.query.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
	constructor(
		@Inject(CommentsRepository) protected commentsRepository: CommentsRepository,
		@Inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
		@Inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
		@Inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
	) {}

	async findCommentById(id: string, userId: string | false) {
		return await this.commentsRepository.findCommentById(new ObjectId(id), userId);
	}

	async createComment(content: string, userId: string, postId: string) {
		const foundUserById = await this.usersQueryRepository.findUserById(new ObjectId(userId));
		if (foundUserById) {
			const newComment = {
				_id: new ObjectId(),
				postId: postId,
				content: content,
				createdAt: new Date().toISOString(),
				commentatorInfo: {
					userId: foundUserById.id,
					userLogin: foundUserById.login,
				},
				likesInfo: {
					likesCount: 0,
					dislikesCount: 0,
					myStatus: 'None',
				},
			};
			return await this.commentsRepository.createComment(newComment);
		} else return null;
	}

	async updateComment(id: string, content: string) {
		return await this.commentsRepository.updateComment(new ObjectId(id), content);
	}

	async deleteComment(id: string) {
		return await this.commentsRepository.deleteComment(new ObjectId(id));
	}

	async deleteAll() {
		return await this.commentsRepository.deleteAll();
	}
}
