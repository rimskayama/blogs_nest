import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsController } from './posts.controller';
import { PostsQueryRepository } from './posts.query.repository';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { JwtBearerStrategy } from '../auth/passport/strategies/jwt-bearer.strategy';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserAuthStrategy } from '../auth/passport/strategies/userId.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';

const strategies = [JwtBearerStrategy, UserAuthStrategy];
const services = [JwtService];
const adapters = [PostsQueryRepository, CommentsQueryRepository];

@Module({
	imports: [ConfigModule.forRoot(), PassportModule, CqrsModule, TypeOrmModule.forFeature([Post])],
	controllers: [PostsController],
	providers: [...services, ...adapters, ...strategies],
	exports: [TypeOrmModule],
})
export class PostsModule {}
