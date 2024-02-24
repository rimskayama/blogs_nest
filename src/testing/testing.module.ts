import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingController } from './testing.controller';
import { BlogsService } from 'src/blogs/blogs.service';
import { BlogsRepository } from 'src/blogs/blogs.repository';
import { BlogsQueryRepository } from 'src/blogs/blogs.query.repository';
import { PostsService } from 'src/posts/posts.service';
import { PostsRepository } from 'src/posts/posts.repository';
import { PostsQueryRepository } from 'src/posts/posts.query.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { UsersQueryRepository } from 'src/users/users.query.repository';
import { Blog, BlogSchema } from 'src/blogs/blogs.entity';
import { Post, PostSchema } from 'src/posts/posts.entity';
import { PostLike, PostLikeSchema } from 'src/likes/likes.entity';
import { User, UserSchema } from 'src/users/users.entity';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
		MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
		MongooseModule.forFeature([{ name: PostLike.name, schema: PostLikeSchema }]),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [TestingController],
	providers: [
		BlogsService,
		BlogsRepository,
		BlogsQueryRepository,
		PostsService,
		PostsRepository,
		PostsQueryRepository,
		UsersService,
		UsersRepository,
		UsersQueryRepository,
	],
})
export class TestingModule {}
