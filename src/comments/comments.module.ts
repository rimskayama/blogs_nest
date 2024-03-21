import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentLike, CommentLikeSchema, PostLike, PostLikeSchema } from '../likes/like.entity';
import { Comment, CommentSchema } from './comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';
import { CommentsQueryRepository } from './comments.query.repository';
import { CommentLikesRepository } from '../likes/comment.likes.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { Post, PostSchema } from '../posts/post.entity';
import { UsersQueryRepository } from '../users/users.query.repository';
import { User, UserSchema } from '../users/user.entity';
import { LikesService } from '../likes/likes.service';
import { PostLikesRepository } from '../likes/post.likes.repository';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MongooseModule.forFeature([{ name: PostLike.name, schema: PostLikeSchema }]),
		MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
		MongooseModule.forFeature([{ name: CommentLike.name, schema: CommentLikeSchema }]),
	],
	controllers: [CommentsController],
	providers: [
		PostsQueryRepository,
		UsersQueryRepository,
		CommentsService,
		CommentsRepository,
		CommentsQueryRepository,
		CommentLikesRepository,
		LikesService,
		PostLikesRepository,
		JwtBearerStrategy,
	],
})
export class CommentsModule {}
