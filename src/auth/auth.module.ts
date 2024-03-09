import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/user.entity';
import { UsersQueryRepository } from '../users/users.query.repository';
import { LocalStrategy } from './passport/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.accessTokenSecret,
			signOptions: { expiresIn: jwtConstants.accessTokenExpirationTime },
		}),
		JwtModule.register({
			secret: jwtConstants.refreshTokenSecret,
			signOptions: { expiresIn: jwtConstants.refreshTokenExpirationTime },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, UsersService, UsersRepository, UsersQueryRepository, LocalStrategy],
})
export class AuthModule {}
