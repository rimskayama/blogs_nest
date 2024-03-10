import { ConfigModule } from '@nestjs/config';
export const configModule = ConfigModule.forRoot();
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { LikesModule } from './likes/likes.module';
import { TestingModule } from './testing/testing.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { DevicesModule } from './devices/devices.module';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [
		configModule,
		MongooseModule.forRoot(process.env.MONGO_URL),
		BlogsModule,
		PostsModule,
		UsersModule,
		LikesModule,
		TestingModule,
		PassportModule,
		AuthModule,
		JwtModule,
		DevicesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
