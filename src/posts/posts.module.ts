import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./posts.entity";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { PostsQueryRepository } from "./posts.query.repository";
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';
import { Blog, BlogSchema } from "src/blogs/blogs.entity";
import { PostLike, PostLikeSchema } from "src/likes/likes.entity";

@Module({
    imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.MONGO_URL),
      MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
      MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
      MongooseModule.forFeature([{ name: PostLike.name, schema: PostLikeSchema }])
    ],
      controllers: [PostsController],
      providers: [BlogsQueryRepository,
        PostsService, PostsRepository, PostsQueryRepository]
  })
  export class PostsModule {}