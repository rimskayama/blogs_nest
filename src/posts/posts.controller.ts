import { PostsService } from './posts.service';
import { PostsQueryRepository } from './posts.query.repository';
import { getPagination } from '../utils/pagination';
import { PostInputDto } from './posts.types';
import { QueryParameters } from '../users/users.types';
import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { exceptionHandler } from '../exceptions/exception.handler';
import { StatusCode, blogIdField, blogNotFound, postIdField, postNotFound } from '../exceptions/exception.constants';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';

@Controller('posts')
export class PostsController {
	constructor(
		@Inject(PostsService) protected postsService: PostsService,
		@Inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository
	) {}

	@Get()
	@HttpCode(200)
	async getPosts(@Query() query: QueryParameters) {
		const { page, limit, sortDirection, sortBy, skip } = getPagination(query);
		//authorization to get likeStatus
		const result = await this.postsQueryRepository.findPosts(page, limit, sortDirection, sortBy, skip);
		return result;
	}

	@Get(':id')
	@HttpCode(200)
	async getPost(@Param('id') blogId: string) {
		//authorization to get likeStatus
		const result = await this.postsQueryRepository.findPostById(blogId);
		if (result) return result;
		else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Post()
	@HttpCode(201)
	async createPost(@Body() inputModel: PostInputDto) {
		const result = await this.postsService.createPost(inputModel);
		if (result) return result;
		else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	// getCommentsOfPost
	// createCommentByPostId
	@UseGuards(BasicAuthGuard)
	@Put(':id')
	@HttpCode(204)
	async updatePost(@Body() inputModel: PostInputDto, @Param('id') id: string) {
		const result = await this.postsService.updatePost(id, inputModel);
		if (result) return;
		else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}

	// updateLikeStatus
	@Delete(':id')
	@HttpCode(204)
	async deletePost(@Param('id') postId: string) {
		const result = await this.postsService.deletePost(postId);
		if (result) return;
		else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}
}
