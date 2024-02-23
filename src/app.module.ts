import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { LikesModule } from './likes/likes.module';
import { TestingModule } from './testing/testing.module';


@Module({
  imports: [
	ConfigModule.forRoot(),
	MongooseModule.forRoot(process.env.MONGO_URL),
	BlogsModule,
	PostsModule,
	UsersModule, 
	LikesModule,
	TestingModule
  ],
	controllers: [],
	providers: []
})
export class AppModule {}
