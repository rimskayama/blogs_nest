import { PostsQueryRepository } from './posts.query.repository';
import { getPagination } from '../utils/pagination';
import { QueryParameters } from '../users/users.types';
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
import { CommentsService } from '../comments/comments.service';
import { LikesService } from '../likes/likes.service';
import { contentInputDto } from '../comments/comments.types';
import { UserAuthGuard } from '../auth/passport/guards/userId.guard';
import { likeInputDto } from '../likes/likes.types';
import { CommentsQueryRepository } from '../comments/comments.query.repository';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsQueryRepository: PostsQueryRepository,
		private readonly commentsService: CommentsService,
		private readonly commentsQueryRepository: CommentsQueryRepository,
		private readonly likesService: LikesService
	) {}

	@UseGuards(UserAuthGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	async getPosts(@Query() query: QueryParameters, @UserFromReq() userId: string | false) {
		const { page, limit, sortDirection, sortBy, skip } = getPagination(query);
		const result = await this.postsQueryRepository.findPosts(page, limit, sortDirection, sortBy, skip, userId);
		return result;
	}

	@UseGuards(UserAuthGuard)
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async getPost(@Param('id') postId: string, @UserFromReq() userId: string | false) {
		const result = await this.postsQueryRepository.findPostById(postId, userId);
		if (result) return result;
		else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}

	@UseGuards(UserAuthGuard)
	@Get(':postId/comments')
	@HttpCode(HttpStatus.OK)
	async getCommentsOfPost(
		@Query() query: QueryParameters,
		@Param('postId') postId: string,
		@UserFromReq() userId: string | false
	) {
		const checkPost = await this.postsQueryRepository.findPostById(postId, userId);

		const { page, limit, sortDirection, sortBy, skip } = getPagination(query);

		if (checkPost) {
			const result = await this.commentsQueryRepository.findCommentsByPostId(
				postId,
				page,
				limit,
				sortDirection,
				sortBy,
				skip,
				userId
			);
			return result;
		} else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}

	@UseGuards(JwtBearerGuard)
	@Post(':postId/comments')
	@HttpCode(HttpStatus.CREATED)
	async createCommentByPostId(
		@Param('postId') postId: string,
		@UserFromReq() userId: string | false,
		@Body() inputModel: contentInputDto
	) {
		const postById = await this.postsQueryRepository.findPostById(postId, userId);
		if (!postById) {
			return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
		}
		let comment = null;
		if (userId) {
			comment = await this.commentsService.createComment(inputModel.content, userId, postId);
		}
		if (comment) {
			return comment;
		} else return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
	}

	@UseGuards(JwtBearerGuard)
	@Put(':postId/like-status')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateLikeStatus(
		@Param('postId') postId: string,
		@UserFromReq() userId: string,
		@Body() inputModel: likeInputDto
	) {
		const post = await this.postsQueryRepository.findPostById(postId, userId);
		if (!post) {
			return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
		} else {
			const checkLikeStatus = await this.likesService.checkPostLikeStatus(inputModel.likeStatus, post.id, userId);
			if (checkLikeStatus) {
				const likesInfo = await this.likesService.countPostLikes(post.id);
				await this.postsQueryRepository.updatePostLikes(post.id, likesInfo.likesCount, likesInfo.dislikesCount);
				return;
			} else {
				const newStatus = await this.likesService.setPostLikeStatus(inputModel.likeStatus, post, userId);
				if (newStatus) {
					const likesInfo = await this.likesService.countPostLikes(post.id);
					await this.postsQueryRepository.updatePostLikes(post.id, likesInfo.likesCount, likesInfo.dislikesCount);
					return;
				}
				return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
			}
		}
	}
}
