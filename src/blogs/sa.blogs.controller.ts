import { BlogsQueryRepository } from './blogs.query.repository';
import { BlogInputDto } from './blogs.types';
import { PostInputDto, SpecifiedPostInputDto } from '../posts/posts.types';
import { exceptionHandler } from '../exceptions/exception.handler';
import { StatusCode, blogIdField, blogNotFound } from '../exceptions/exception.constants';
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
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from './use-cases/create-blog.use-case';
import { CreatePostCommand } from './use-cases/create-post.use-case';
import { UpdateBlogCommand } from './use-cases/update-blog.use-case';
import { DeleteBlogCommand } from './use-cases/delete-blog.use-case';
import { UpdatePostCommand } from './use-cases/update-post.use-case';
import { DeletePostCommand } from './use-cases/delete-post.use-case';

@Controller('sa/blogs')
export class SuperAdminBlogsController {
	constructor(
		private commandBus: CommandBus,
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
		const result = await this.commandBus.execute(new CreateBlogCommand(inputModel));
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Put(':blogId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateBlog(@Body() inputModel: BlogInputDto, @Param('blogId') blogId: string) {
		const result = await this.commandBus.execute(new UpdateBlogCommand(blogId, inputModel));

		if (result.code !== StatusCode.Success) {
			return exceptionHandler(result.code, result.message, result.field);
		}
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Delete(':blogId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteBlog(@Param('blogId') blogId: string) {
		const result = await this.commandBus.execute(new DeleteBlogCommand(blogId));
		if (result.code !== StatusCode.Success) {
			return exceptionHandler(result.code, result.message, result.field);
		}
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Post(':blogId/posts')
	@HttpCode(HttpStatus.CREATED)
	async createPostForSpecifiedBlog(@Body() inputModel: SpecifiedPostInputDto, @Param('blogId') blogId: string) {
		const blog = await this.blogsQueryRepository.findBlogById(blogId);
		if (!blog) return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);

		const result = await this.commandBus.execute(new CreatePostCommand(inputModel, blogId, blog.name));
		if (result) {
			return result;
		} else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Put(':blogId/posts/:postId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updatePost(@Body() inputModel: PostInputDto, @Param('blogId') blogId: string, @Param('postId') postId: string) {
		const result = await this.commandBus.execute(new UpdatePostCommand(blogId, postId, inputModel));
		if (result.code !== StatusCode.Success) {
			return exceptionHandler(result.code, result.message, result.field);
		}
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Delete(':blogId/posts/:postId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deletePost(@Param('blogId') blogId: string, @Param('postId') postId: string) {
		const result = await this.commandBus.execute(new DeletePostCommand(blogId, postId));
		if (result.code !== StatusCode.Success) {
			return exceptionHandler(result.code, result.message, result.field);
		}
		return result;
	}
}
