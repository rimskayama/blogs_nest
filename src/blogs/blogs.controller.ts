import { getPagination } from '../utils/pagination';
import { BlogsService } from './blogs.service';
import { PostsService } from '../posts/posts.service';
import { BlogsQueryRepository } from './blogs.query.repository';
import { BlogInputDto } from './blogs.types';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { SpecifiedPostInputDto } from '../posts/posts.types';
import { QueryParameters } from '../users/users.types';
import { exceptionHandler } from '../exceptions/exception.handler';
import { StatusCode, blogIdField, blogNotFound } from '../exceptions/exception.constants';
import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Put, Query } from '@nestjs/common';

@Controller('blogs')
export class BlogsController {
	constructor(
		@Inject(BlogsService) protected blogsService: BlogsService,
		@Inject(PostsService) protected postsService: PostsService,
		@Inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
		@Inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository
	) {}

	@Get()
	@HttpCode(200)
	async getBlogs(@Query() query: QueryParameters) {
		const { page, limit, sortDirection, sortBy, searchNameTerm, skip } = getPagination(query);
		//authorization to get likeStatus to send to Query
		const result = await this.blogsQueryRepository.findBlogs(page, limit, sortDirection, sortBy, searchNameTerm, skip);
		return result;
	}

	@Get(':id')
	@HttpCode(200)
	async getBlog(@Param('id') blogId: string) {
		//authorization to get likeStatus
		const result = await this.blogsQueryRepository.findBlogById(blogId);
		if (result) {
			return result;
		} else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@Get(':id/posts')
	@HttpCode(200)
	async getPostsOfBlog(@Param('id') blogId: string, @Query() query: QueryParameters) {
		const blog = await this.blogsQueryRepository.findBlogById(blogId);
		const { page, limit, sortDirection, sortBy, skip } = getPagination(query);

		//authorization to set likeStatus

		if (blog) {
			const result = await this.postsQueryRepository.findPostsByBlogId(
				blogId,
				page,
				limit,
				sortDirection,
				sortBy,
				skip
			);
			return result;
		} else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@Post()
	@HttpCode(201)
	async createBlog(@Body() inputModel: BlogInputDto) {
		const result = await this.blogsService.createBlog(inputModel);
		return result;
	}

	@Post(':id/posts')
	@HttpCode(201)
	async createPostForSpecifiedBlog(@Body() inputModel: SpecifiedPostInputDto, @Param('id') blogId: string) {
		const postModel = {
			...inputModel,
			blogId: blogId,
		};
		const result = await this.postsService.createPost(postModel);
		if (result) {
			return result;
		} else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@Put(':id')
	@HttpCode(204)
	async updateBlog(@Body() inputModel: BlogInputDto, @Param('id') blogId: string) {
		const result = await this.blogsService.updateBlog(blogId, inputModel);
		if (result) return result;
		else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@Delete(':id')
	@HttpCode(204)
	async deleteBlog(@Param('id') blogId: string) {
		const result = await this.blogsService.deleteBlog(blogId);
		if (!result) return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}
}
