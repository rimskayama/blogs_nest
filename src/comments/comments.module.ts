import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsQueryRepository } from './comments.query.repository';
import { CommentLikesRepository } from '../likes/comment.likes.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { UsersQueryRepository } from '../users/users.query.repository';
import { PostLikesRepository } from '../likes/post.likes.repository';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentUseCase } from './use-cases/create-comment.use-case';
import { UpdateCommentUseCase } from './use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from './use-cases/delete-comment.use-case';

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
	imports: [ConfigModule.forRoot(), CqrsModule],
	controllers: [CommentsController],
	providers: [...adapters, ...strategies, ...useCases],
})
export class CommentsModule {}
