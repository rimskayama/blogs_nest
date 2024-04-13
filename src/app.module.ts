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
import { CommentsModule } from './comments/comments.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		configModule,
		MongooseModule.forRoot(process.env.MONGO_URL),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: process.env.PGUSER,
			password: process.env.PGPASSWORD,
			database: process.env.PGDATABASE,
			autoLoadEntities: false,
			synchronize: false,
		}),
		BlogsModule,
		PostsModule,
		UsersModule,
		LikesModule,
		TestingModule,
		PassportModule,
		AuthModule,
		JwtModule,
		DevicesModule,
		CommentsModule,
		LikesModule,
		CqrsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
