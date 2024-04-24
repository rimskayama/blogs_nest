import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LikesService } from './likes.service';
import { PostLikesRepository } from './post.likes.repository';
import { CommentLikesRepository } from './comment.likes.repository';
import { UsersQueryRepository } from '../users/users.query.repository';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';
import { CqrsModule } from '@nestjs/cqrs';

const adapters = [PostLikesRepository, CommentLikesRepository, UsersQueryRepository];

@Module({
	imports: [ConfigModule.forRoot(), CqrsModule],
	controllers: [],
	providers: [LikesService, JwtBearerStrategy, ...adapters],
})
export class LikesModule {}
