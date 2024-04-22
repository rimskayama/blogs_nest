import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogs.query.repository';
import { BlogInputDto } from './blogs.types';
import { PostInputDto, SpecifiedPostInputDto } from '../posts/posts.types';
import { exceptionHandler } from '../exceptions/exception.handler';
import { StatusCode, blogIdField, blogNotFound, postIdField, postNotFound } from '../exceptions/exception.constants';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth/passport/guards/basic-auth.guard';
import { QueryParameters } from '../users/users.types';
import { getPagination } from '../utils/pagination';

@Controller('sa/blogs')
export class SuperAdminBlogsController {
	constructor(
		private readonly blogsService: BlogsService,
		private readonly blogsQueryRepository: BlogsQueryRepository
	) {}

	@UseGuards(BasicAuthGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	async getBlogs(@Query() query: QueryParameters) {
		const { page, limit, sortDirection, sortBy, searchNameTerm, skip } = getPagination(query);
		const result = await this.blogsQueryRepository.findBlogs(page, limit, sortDirection, sortBy, searchNameTerm, skip);
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Get(':blogId')
	@HttpCode(HttpStatus.OK)
	async getBlog(@Param('blogId') blogId: string) {
		const result = await this.blogsQueryRepository.findBlogById(blogId);
		if (result) {
			return result;
		} else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createBlog(@Body() inputModel: BlogInputDto) {
		const result = await this.blogsService.createBlog(inputModel);
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Put(':blogId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateBlog(@Body() inputModel: BlogInputDto, @Param('blogId') blogId: string) {
		const result = await this.blogsService.updateBlog(blogId, inputModel);
		if (result) return result;
		else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Delete(':blogId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteBlog(@Param('blogId') blogId: string) {
		const result = await this.blogsService.deleteBlog(blogId);
		if (!result) return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Post(':blogId/posts')
	@HttpCode(HttpStatus.CREATED)
	async createPostForSpecifiedBlog(@Body() inputModel: SpecifiedPostInputDto, @Param('blogId') blogId: string) {
		const blog = await this.blogsQueryRepository.findBlogById(blogId);
		if (!blog) return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);

		const result = await this.blogsService.createPostForSpecifiedBlog(inputModel, blogId, blog.name);
		if (result) {
			return result;
		} else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Put(':blogId/posts/:postId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updatePost(@Body() inputModel: PostInputDto, @Param('blogId') blogId: string, @Param('postId') postId: string) {
		const blog = await this.blogsQueryRepository.findBlogById(blogId);
		if (!blog) return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);

		const result = await this.blogsService.updatePost(blogId, postId, inputModel);
		if (result) return;
		else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Delete(':blogId/posts/:postId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deletePost(@Param('blogId') blogId: string, @Param('postId') postId: string) {
		const blog = await this.blogsQueryRepository.findBlogById(blogId);
		if (!blog) return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);

		const result = await this.blogsService.deletePost(postId);
		if (result) return;
		else return exceptionHandler(StatusCode.NotFound, postNotFound, postIdField);
	}
}
