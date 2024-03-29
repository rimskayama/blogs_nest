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
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../auth/passport/guards/basic-auth.guard';
import { UserFromReq } from '../auth/decorators/userId.decorator';
import { UserAuthGuard } from '../auth/passport/guards/userId.guard';

@Controller('blogs')
export class BlogsController {
	constructor(
		private readonly blogsService: BlogsService,
		private readonly postsService: PostsService,
		private readonly blogsQueryRepository: BlogsQueryRepository,
		private readonly postsQueryRepository: PostsQueryRepository
	) {}

	@Get()
	@HttpCode(200)
	async getBlogs(@Query() query: QueryParameters) {
		const { page, limit, sortDirection, sortBy, searchNameTerm, skip } = getPagination(query);
		const result = await this.blogsQueryRepository.findBlogs(page, limit, sortDirection, sortBy, searchNameTerm, skip);
		return result;
	}

	@Get(':id')
	@HttpCode(200)
	async getBlog(@Param('id') blogId: string) {
		const result = await this.blogsQueryRepository.findBlogById(blogId);
		if (result) {
			return result;
		} else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@UseGuards(UserAuthGuard)
	@Get(':id/posts')
	@HttpCode(200)
	async getPostsOfBlog(
		@Param('id') blogId: string,
		@Query() query: QueryParameters,
		@UserFromReq() userId: string | false
	) {
		const blog = await this.blogsQueryRepository.findBlogById(blogId);
		const { page, limit, sortDirection, sortBy, skip } = getPagination(query);

		if (blog) {
			const result = await this.postsQueryRepository.findPostsByBlogId(
				blogId,
				page,
				limit,
				sortDirection,
				sortBy,
				skip,
				userId
			);
			return result;
		} else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Post()
	@HttpCode(201)
	async createBlog(@Body() inputModel: BlogInputDto) {
		const result = await this.blogsService.createBlog(inputModel);
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Post(':id/posts')
	@HttpCode(201)
	async createPostForSpecifiedBlog(@Body() inputModel: SpecifiedPostInputDto, @Param('id') blogId: string) {
		const blog = await this.blogsQueryRepository.findBlogById(blogId);
		if (!blog) return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);

		const postModel = {
			...inputModel,
			blogId: blogId,
		};
		const result = await this.postsService.createPost(postModel, blog.name);
		if (result) {
			return result;
		} else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Put(':id')
	@HttpCode(204)
	async updateBlog(@Body() inputModel: BlogInputDto, @Param('id') blogId: string) {
		const result = await this.blogsService.updateBlog(blogId, inputModel);
		if (result) return result;
		else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Delete(':id')
	@HttpCode(204)
	async deleteBlog(@Param('id') blogId: string) {
		const result = await this.blogsService.deleteBlog(blogId);
		if (!result) return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}
}
