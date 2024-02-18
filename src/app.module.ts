import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog } from './blogs/blogs.entity';;
import { BlogSchema } from './blogs/blogs.entity';
import { BlogsQueryRepository } from './blogs/blogs.query.repository';
import { Post, PostSchema } from './posts/posts.entity';
import { User, UserSchema } from './users/users.entity';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsRepository } from './posts/posts.repository';
import { PostsQueryRepository } from './posts/posts.query.repository';
import { PostLike, PostLikeSchema } from './likes/likes.entity';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { UsersQueryRepository } from './users/users.query.repository';

@Module({
  imports: [
	MongooseModule.forRoot(process.env.MONGO_URL || `mongodb://0.0.0.0:27017/Nest`),
	MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
	MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
	MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	MongooseModule.forFeature([{ name: PostLike.name, schema: PostLikeSchema }]),
  ],
	controllers: [AppController, BlogsController, PostsController, UsersController],
	providers: [AppService, BlogsService, BlogsRepository, BlogsQueryRepository,
				PostsService, PostsRepository, PostsQueryRepository,
				UsersService, UsersRepository, UsersQueryRepository]
})
export class AppModule {}
