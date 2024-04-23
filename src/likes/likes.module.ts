import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentLike, CommentLikeSchema, PostLike, PostLikeSchema } from './like.entity';
import { LikesService } from './likes.service';
import { PostLikesRepository } from './post.likes.repository';
import { CommentLikesRepository } from './comment.likes.repository';
import { UsersQueryRepository } from '../users/users.query.repository';
import { User, UserSchema } from '../users/user.entity';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';
import { CqrsModule } from '@nestjs/cqrs';

const adapters = [PostLikesRepository, CommentLikesRepository, UsersQueryRepository];

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MongooseModule.forFeature([{ name: PostLike.name, schema: PostLikeSchema }]),
		MongooseModule.forFeature([{ name: CommentLike.name, schema: CommentLikeSchema }]),
		CqrsModule,
	],
	controllers: [],
	providers: [LikesService, JwtBearerStrategy, ...adapters],
})
export class LikesModule {}
