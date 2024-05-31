import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostLikesRepository } from './repositories/post.likes.repository';
import { CommentLikesRepository } from './repositories/comment.likes.repository';
import { UsersQueryRepository } from '../users/repositories/users.query.repository';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { CheckCommentLikeStatusUseCase } from './application/use-cases/comment likes/check-comment-like-status.use-case';
import { SetCommentLikeStatusUseCase } from './application/use-cases/comment likes/set-comment-like-status.use-case';
import { CheckPostLikeStatusUseCase } from './application/use-cases/post likes/check-post-likes-status.use-case';
import { SetPostLikeStatusUseCase } from './application/use-cases/post likes/set-post-like-status.use-case';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLike } from './domain/comment-like.entity';
import { PostLike } from './domain/post-like.entity';

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
