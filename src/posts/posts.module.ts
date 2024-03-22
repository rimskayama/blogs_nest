import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostsQueryRepository } from './posts.query.repository';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { Blog, BlogSchema } from '../blogs/blog.entity';
import { CommentLike, CommentLikeSchema, PostLike, PostLikeSchema } from '../likes/like.entity';
import { CommentsService } from '../comments/comments.service';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { CommentsRepository } from '../comments/comments.repository';
import { UsersQueryRepository } from '../users/users.query.repository';
import { Comment, CommentSchema } from '../comments/comment.entity';
import { User, UserSchema } from '../users/user.entity';
import { LikesService } from '../likes/likes.service';
import { PostLikesRepository } from '../likes/post.likes.repository';
import { CommentLikesRepository } from '../likes/comment.likes.repository';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
		MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
		MongooseModule.forFeature([{ name: CommentLike.name, schema: CommentLikeSchema }]),
		MongooseModule.forFeature([{ name: PostLike.name, schema: PostLikeSchema }]),
		PassportModule,
	],
	controllers: [PostsController],
	providers: [
		JwtService,
		BlogsQueryRepository,
		PostsService,
		PostsRepository,
		PostsQueryRepository,
		CommentsService,
		CommentsRepository,
		CommentsQueryRepository,
		UsersQueryRepository,
		LikesService,
		PostLikesRepository,
		CommentLikesRepository,
		JwtBearerStrategy,
	],
})
export class PostsModule {}
