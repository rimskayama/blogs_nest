import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './repositories/comments.repository';
import { CommentsQueryRepository } from './repositories/comments.query.repository';
import { CommentLikesRepository } from '../likes/comment.likes.repository';
import { PostsQueryRepository } from '../posts/repositories/posts.query.repository';
import { UsersQueryRepository } from '../users/repositories/users.query.repository';
import { PostLikesRepository } from '../likes/post.likes.repository';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.use-case';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './domain/comment.entity';

const strategies = [JwtBearerStrategy];
const adapters = [
	PostsQueryRepository,
	UsersQueryRepository,
	CommentsRepository,
	CommentsQueryRepository,
	CommentLikesRepository,
	PostLikesRepository,
];
const useCases = [CreateCommentUseCase, UpdateCommentUseCase, DeleteCommentUseCase];

@Module({
	imports: [ConfigModule.forRoot(), CqrsModule, UsersModule, PostsModule, TypeOrmModule.forFeature([Comment])],
	controllers: [CommentsController],
	providers: [...adapters, ...strategies, ...useCases],
})
export class CommentsModule {}
