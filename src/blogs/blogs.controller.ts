import { getPagination } from '../utils/pagination';
import { BlogsQueryRepository } from './repositories/blogs.query.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { UserFromGuard } from '../users/users.types';
import { QueryParameters } from '../utils/pagination.types';
import { exceptionHandler } from '../exceptions/exception.handler';
import { Get, HttpCode, Param, Query, UseGuards, Controller, HttpStatus } from '@nestjs/common';
import { UserFromReq } from '../auth/decorators/userId.decorator';
import { UserAuthGuard } from '../auth/passport/guards/userId.guard';
import { StatusCode, blogIdField, blogNotFound } from '../exceptions/exception.constants';

@Controller('blogs')
export class BlogsController {
	constructor(
		private readonly blogsQueryRepository: BlogsQueryRepository,
		private readonly postsQueryRepository: PostsQueryRepository
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getBlogs(@Query() query: QueryParameters) {
		const { page, limit, sortDirection, sortBy, searchNameTerm } = getPagination(query);
		const result = await this.blogsQueryRepository.findBlogs(page, limit, sortDirection, sortBy, searchNameTerm);
		return result;
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async getBlog(@Param('id') blogId: string) {
		const result = await this.blogsQueryRepository.findBlogById(blogId);
		if (result) {
			return result;
		} else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}

	@UseGuards(UserAuthGuard)
	@Get(':id/posts')
	@HttpCode(HttpStatus.OK)
	async getPostsOfBlog(
		@Param('id') blogId: string,
		@Query() query: QueryParameters,
		@UserFromReq() user: UserFromGuard
	) {
		const blog = await this.blogsQueryRepository.findBlogById(blogId);
		const { page, limit, sortDirection, sortBy } = getPagination(query);

		if (blog) {
			const result = await this.postsQueryRepository.findPostsByBlogId(
				blogId,
				page,
				limit,
				sortDirection,
				sortBy,
				user.id
			);
			return result;
		} else return exceptionHandler(StatusCode.NotFound, blogNotFound, blogIdField);
	}
}
