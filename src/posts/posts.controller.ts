import { PostsQueryRepository } from './posts.query.repository';
import { getPagination } from '../utils/pagination';
import { UserFromGuard } from '../users/users.types';
import { QueryParameters } from '../utils/pagination.types';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { exceptionHandler } from '../exceptions/exception.handler';
import {
	StatusCode,
	commentIdField,
	commentNotFound,
	postIdField,
	postNotFound,
} from '../exceptions/exception.constants';
import { UserFromReq } from '../auth/decorators/userId.decorator';
import { JwtBearerGuard } from '../auth/passport/guards/jwt-bearer.guard';
import { contentInputDto } from '../comments/comments.types';
import { UserAuthGuard } from '../auth/passport/guards/userId.guard';
import { likeInputDto } from '../likes/likes.types';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../comments/use-cases/create-comment.use-case';
import { CheckPostLikeStatusCommand } from '../likes/use-cases/post likes/check-post-likes-status.use-case';
import { SetPostLikeStatusCommand } from '../likes/use-cases/post likes/set-post-like-status.use-case';

@Controller('posts')
export class PostsController {
	constructor(
		private commandBus: CommandBus,
		private readonly postsQueryRepository: PostsQueryRepository,
		private readonly commentsQueryRepository: CommentsQueryRepository
	) {}

	@UseGuards(UserAuthGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	async getPosts(@Query() query: QueryParameters, @UserFromReq() user: UserFromGuard) {
		const { page, limit, sortDirection, sortBy } = getPagination(query);
		const result = await this.postsQueryRepository.findPosts(page, limit, sortDirection, sortBy, user.id);
		return result;
	}

	@UseGuards(UserAuthGuard)
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async getPost(@Param('id') postId: string, @UserFromReq() user: UserFromGuard) {
		const result = await this.postsQueryRepository.findPostById(postId, user.id);
		if (result) return result;
		else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}

	@UseGuards(UserAuthGuard)
	@Get(':postId/comments')
	@HttpCode(HttpStatus.OK)
	async getCommentsOfPost(
		@Query() query: QueryParameters,
		@Param('postId') postId: string,
		@UserFromReq() user: UserFromGuard
	) {
		const checkPost = await this.postsQueryRepository.findPostById(postId, user.id);

		const { page, limit, sortDirection, sortBy } = getPagination(query);

		if (checkPost) {
			const result = await this.commentsQueryRepository.findCommentsByPostId(
				postId,
				page,
				limit,
				sortDirection,
				sortBy,
				user.id
			);
			return result;
		} else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}

	@UseGuards(JwtBearerGuard)
	@Post(':postId/comments')
	@HttpCode(HttpStatus.CREATED)
	async createCommentByPostId(
		@Param('postId') postId: string,
		@UserFromReq() user: UserFromGuard,
		@Body() inputModel: contentInputDto
	) {
		const postById = await this.postsQueryRepository.findPostById(postId, user.id);
		if (!postById) {
			return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
		}
		const comment = await this.commandBus.execute(new CreateCommentCommand(inputModel, postId, user.id, user.login));
		if (comment) {
			return comment;
		} else return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
	}

	@UseGuards(JwtBearerGuard)
	@Put(':postId/like-status')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateLikeStatus(
		@Param('postId') postId: string,
		@UserFromReq() user: UserFromGuard,
		@Body() inputModel: likeInputDto
	) {
		const post = await this.postsQueryRepository.findPostById(postId, user.id);
		if (!post) {
			return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
		} else {
			const checkLikeStatus = await this.commandBus.execute(
				new CheckPostLikeStatusCommand(inputModel.likeStatus, post.id, user.id)
			);
			if (!checkLikeStatus) {
				const newStatus = await this.commandBus.execute(
					new SetPostLikeStatusCommand(inputModel.likeStatus, post.id, user.id, user.login)
				);
				if (!newStatus) {
					return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
				} else return;
			}
		}
	}
}
