import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsController } from './posts.controller';
import { PostsQueryRepository } from './repositories/posts.query.repository';
import { CommentsQueryRepository } from '../comments/repositories/comments.query.repository';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserAuthStrategy } from '../auth/passport/strategies/userId.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/post.entity';
import { Comment } from '../comments/domain/comment.entity';
import { CommentLike } from '../likes/comment-like.entity';
import { PostLike } from '../likes/post-like.entity';

const strategies = [JwtBearerStrategy, UserAuthStrategy];
const services = [JwtService];
const adapters = [PostsQueryRepository, CommentsQueryRepository];

@Module({
	imports: [
		ConfigModule.forRoot(),
		PassportModule,
		CqrsModule,
		TypeOrmModule.forFeature([Post]),
		TypeOrmModule.forFeature([Comment]),
		TypeOrmModule.forFeature([CommentLike]),
		TypeOrmModule.forFeature([PostLike]),
	],
	controllers: [PostsController],
	providers: [...services, ...adapters, ...strategies],
	exports: [TypeOrmModule],
})
export class PostsModule {}
