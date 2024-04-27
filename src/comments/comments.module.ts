import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';
import { CommentsQueryRepository } from './comments.query.repository';
import { CommentLikesRepository } from '../likes/comment.likes.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { UsersQueryRepository } from '../users/users.query.repository';
import { PostLikesRepository } from '../likes/post.likes.repository';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentUseCase } from './use-cases/create-comment.use-case';

const strategies = [JwtBearerStrategy];
const services = [CommentsService];
const adapters = [
	PostsQueryRepository,
	UsersQueryRepository,
	CommentsRepository,
	CommentsQueryRepository,
	CommentLikesRepository,
	PostLikesRepository,
];
const useCases = [CreateCommentUseCase];

@Module({
	imports: [ConfigModule.forRoot(), CqrsModule],
	controllers: [CommentsController],
	providers: [...services, ...adapters, ...strategies, ...useCases],
})
export class CommentsModule {}
