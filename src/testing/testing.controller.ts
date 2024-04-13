import { BlogsService } from '../blogs/blogs.service';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { Controller, Delete, HttpCode } from '@nestjs/common';

@Controller('testing')
export class TestingController {
	constructor(
		private readonly blogsService: BlogsService,
		private readonly postsService: PostsService,
		private readonly usersService: UsersService
	) {}

	@Delete('all-data')
	@HttpCode(204)
	async deleteAll() {
		await this.blogsService.deleteAll();
		await this.postsService.deleteAll();
		await this.usersService.deleteAll();
	}
}
