import { v4 as uuidv4 } from 'uuid';
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

	async createComment(content: string, userId: string, postId: string) {
		const foundUserById = await this.usersQueryRepository.findUserById(userId);
		if (foundUserById) {
			const newComment = {
				id: uuidv4(),
				postId: postId,
				content: content,
				createdAt: new Date(),
				commentatorId: foundUserById.id,
				commentatorLogin: foundUserById.login,
				likesCount: 0,
				dislikesCount: 0,
			};
			return await this.commentsRepository.createComment(newComment);
		} else return null;
	}

	async updateComment(id: string, content: string) {
		return await this.commentsRepository.updateComment(id, content);
	}

	async deleteComment(id: string) {
		return await this.commentsRepository.deleteComment(id);
	}
}
