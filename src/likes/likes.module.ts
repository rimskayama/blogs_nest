import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostLikesRepository } from './post.likes.repository';
import { CommentLikesRepository } from './comment.likes.repository';
import { UsersQueryRepository } from '../users/users.query.repository';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { CheckCommentLikeStatusUseCase } from './use-cases/comment likes/check-comment-like-status.use-case';
import { SetCommentLikeStatusUseCase } from './use-cases/comment likes/set-comment-like-status.use-case';
import { CheckPostLikeStatusUseCase } from './use-cases/post likes/check-post-likes-status.use-case';
import { SetPostLikeStatusUseCase } from './use-cases/post likes/set-post-like-status.use-case';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLike } from './comment-like.entity';
import { PostLike } from './post-like.entity';

const adapters = [PostLikesRepository, CommentLikesRepository, UsersQueryRepository];
const strategies = [JwtBearerStrategy];
const useCases = [
	CheckCommentLikeStatusUseCase,
	SetCommentLikeStatusUseCase,
	CheckPostLikeStatusUseCase,
	SetPostLikeStatusUseCase,
];

@Module({
	imports: [
		ConfigModule.forRoot(),
		CqrsModule,
		UsersModule,
		TypeOrmModule.forFeature([PostLike]),
		TypeOrmModule.forFeature([CommentLike]),
		TypeOrmModule.forFeature([PostLike]),
	],
	controllers: [],
	providers: [...adapters, ...strategies, ...useCases],
})
export class LikesModule {}
