import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogsController } from './blogs.controller';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogsQueryRepository } from './repositories/blogs.query.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { SuperAdminBlogsController } from './sa.blogs.controller';
import { UserAuthStrategy } from '../auth/passport/strategies/userId.strategy';
import { BasicStrategy } from '../auth/passport/strategies/basic-strategy';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogUseCase } from './application/use-cases/create-blog.use-case';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { UpdateBlogUseCase } from './application/use-cases/update-blog.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { DeleteBlogUseCase } from './application/use-cases/delete-blog.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { PostsModule } from '../posts/posts.module';

const adapters = [BlogsRepository, BlogsQueryRepository, PostsQueryRepository];
const strategies = [UserAuthStrategy, BasicStrategy];
const useCases = [
	CreateBlogUseCase,
	CreatePostUseCase,
	UpdateBlogUseCase,
	UpdatePostUseCase,
	DeleteBlogUseCase,
	DeletePostUseCase,
];

@Module({
	imports: [ConfigModule.forRoot(), PassportModule, CqrsModule, TypeOrmModule.forFeature([Blog]), PostsModule],
	controllers: [BlogsController, SuperAdminBlogsController],
	providers: [...adapters, ...strategies, ...useCases],
})
export class BlogsModule {}
