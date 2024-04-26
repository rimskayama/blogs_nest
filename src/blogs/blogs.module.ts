import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogsQueryRepository } from './blogs.query.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { SuperAdminBlogsController } from './sa.blogs.controller';
import { UserAuthStrategy } from '../auth/passport/strategies/userId.strategy';
import { BasicStrategy } from '../auth/passport/strategies/basic-strategy';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogUseCase } from './use-cases/create-blog.use-case';
import { CreatePostUseCase } from './use-cases/create-post.use-case';

const services = [BlogsService];
const adapters = [BlogsRepository, BlogsQueryRepository, PostsQueryRepository];
const strategies = [UserAuthStrategy, BasicStrategy];
const useCases = [CreateBlogUseCase, CreatePostUseCase];

@Module({
	imports: [ConfigModule.forRoot(), PassportModule, CqrsModule],
	controllers: [BlogsController, SuperAdminBlogsController],
	providers: [...services, ...adapters, ...strategies, ...useCases],
})
export class BlogsModule {}
