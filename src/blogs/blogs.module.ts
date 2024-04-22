import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.entity';
import { Post } from '../posts/post.entity';
import { PostSchema } from '../posts/post.entity';
import { PostLike, PostLikeSchema } from '../likes/like.entity';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogsQueryRepository } from './blogs.query.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { SuperAdminBlogsController } from './sa.blogs.controller';
import { UserAuthStrategy } from '../auth/passport/strategies/userId.strategy';
import { BasicStrategy } from '../auth/passport/strategies/basic-strategy';
import { PassportModule } from '@nestjs/passport';

const services = [BlogsService];
const adapters = [BlogsRepository, BlogsQueryRepository, PostsQueryRepository];

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
		MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
		MongooseModule.forFeature([{ name: PostLike.name, schema: PostLikeSchema }]),
		PassportModule,
	],
	controllers: [BlogsController, SuperAdminBlogsController],
	providers: [...services, ...adapters, UserAuthStrategy, BasicStrategy],
})
export class BlogsModule {}
