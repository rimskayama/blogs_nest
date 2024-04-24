import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsController } from './posts.controller';
import { PostsQueryRepository } from './posts.query.repository';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { CommentsService } from '../comments/comments.service';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { CommentsRepository } from '../comments/comments.repository';
import { UsersQueryRepository } from '../users/users.query.repository';
import { LikesService } from '../likes/likes.service';
import { PostLikesRepository } from '../likes/post.likes.repository';
import { CommentLikesRepository } from '../likes/comment.likes.repository';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserAuthStrategy } from '../auth/passport/strategies/userId.strategy';
import { CqrsModule } from '@nestjs/cqrs';

const strategies = [JwtBearerStrategy, UserAuthStrategy];
const services = [JwtService, CommentsService, LikesService];
const adapters = [
	BlogsQueryRepository,
	PostsQueryRepository,
	CommentsRepository,
	CommentsQueryRepository,
	UsersQueryRepository,
	PostLikesRepository,
	CommentLikesRepository,
];

@Module({
	imports: [ConfigModule.forRoot(), PassportModule, CqrsModule],
	controllers: [PostsController],
	providers: [...services, ...adapters, ...strategies],
})
export class PostsModule {}
