import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingController } from './testing.controller';
import { BlogsRepository } from '../blogs/blogs.repository';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { UsersQueryRepository } from '../users/users.query.repository';

@Module({
	imports: [ConfigModule.forRoot()],
	controllers: [TestingController],
	providers: [
		BlogsRepository,
		BlogsQueryRepository,
		PostsQueryRepository,
		UsersService,
		UsersRepository,
		UsersQueryRepository,
	],
})
export class TestingModule {}
