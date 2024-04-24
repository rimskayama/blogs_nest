import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SuperAdminUsersController } from './sa.users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersQueryRepository } from './users.query.repository';
import { BasicStrategy } from '../auth/passport/strategies/basic-strategy';

const adapters = [UsersRepository, UsersQueryRepository];
const strategies = [BasicStrategy];

@Module({
	imports: [ConfigModule.forRoot()],
	controllers: [SuperAdminUsersController],
	providers: [UsersService, ...adapters, ...strategies],
})
export class UsersModule {}
