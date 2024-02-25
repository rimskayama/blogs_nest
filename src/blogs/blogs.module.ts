import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs.entity';
import { Post, PostSchema } from 'src/posts/posts.entity';
import { PostLike, PostLikeSchema } from 'src/likes/likes.entity';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogsQueryRepository } from './blogs.query.repository';
import { PostsService } from 'src/posts/posts.service';
import { PostsRepository } from '../posts/posts.repository';
import { PostsQueryRepository } from 'src/posts/posts.query.repository';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
		MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
		MongooseModule.forFeature([{ name: PostLike.name, schema: PostLikeSchema }]),
	],
	controllers: [BlogsController],
	providers: [BlogsService, BlogsRepository, BlogsQueryRepository, PostsService, PostsRepository, PostsQueryRepository],
})
export class BlogsModule {}
