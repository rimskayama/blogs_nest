import { PostsService } from './posts.service';
import { PostsQueryRepository } from './posts.query.repository';
import { getPagination } from '../utils/pagination';
import { PostInputDto } from './posts.types';
import { QueryParameters } from '../users/users.types';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { exceptionHandler } from '../exceptions/exception.handler';
import {
	StatusCode,
	blogIdField,
	blogNotFound,
	commentIdField,
	commentNotFound,
	postIdField,
	postNotFound,
} from '../exceptions/exception.constants';
import { BasicAuthGuard } from '../auth/passport/guards/basic-auth.guard';
import { UserFromReq } from '../auth/decorators/userId.decorator';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { JwtBearerGuard } from '../auth/passport/guards/jwt-bearer.guard';
import { CommentsService } from '../comments/comments.service';
import { LikesService } from '../likes/likes.service';
import { likeInputDto } from '../likes/likes.types';
import { contentInputDto } from '../comments/comments.types';
import { UserAuthGuard } from '../auth/passport/guards/userId.guard';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly blogsQueryRepository: BlogsQueryRepository,
		private readonly postsService: PostsService,
		private readonly postsQueryRepository: PostsQueryRepository,
		private readonly commentsService: CommentsService,
		private readonly commentsQueryRepository: CommentsQueryRepository,
		private readonly likesService: LikesService
	) {}

	@UseGuards(UserAuthGuard)
	@Get()
	@HttpCode(200)
	async getPosts(@Query() query: QueryParameters, @UserFromReq() userId: string | false) {
		const { page, limit, sortDirection, sortBy, skip } = getPagination(query);
		const result = await this.postsQueryRepository.findPosts(page, limit, sortDirection, sortBy, skip, userId);
		return result;
	}

	@UseGuards(UserAuthGuard)
	@Get(':id')
	@HttpCode(200)
	async getPost(@Param('id') postId: string, @UserFromReq() userId: string | false) {
		const result = await this.postsQueryRepository.findPostById(postId, userId);
		if (result) return result;
		else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Post()
	@HttpCode(201)
	async createPost(@Body() inputModel: PostInputDto) {
		const blog = await this.blogsQueryRepository.findBlogById(inputModel.blogId);
		if (!blog) return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);

		return await this.postsService.createPost(inputModel, blog.name);
	}

	@UseGuards(UserAuthGuard)
	@Get(':postId/comments')
	@HttpCode(200)
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
	@HttpCode(201)
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

	@UseGuards(BasicAuthGuard)
	@Put(':id')
	@HttpCode(204)
	async updatePost(@Body() inputModel: PostInputDto, @Param('id') id: string) {
		const blog = await this.blogsQueryRepository.findBlogById(inputModel.blogId);
		if (!blog) return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);

		const result = await this.postsService.updatePost(id, inputModel);
		if (result) return;
		else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}

	@UseGuards(JwtBearerGuard)
	@Put(':postId/like-status')
	@HttpCode(204)
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

	@UseGuards(BasicAuthGuard)
	@Delete(':id')
	@HttpCode(204)
	async deletePost(@Param('id') postId: string) {
		const result = await this.postsService.deletePost(postId);
		if (result) return;
		else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}
}
