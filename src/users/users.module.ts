import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SuperAdminUsersController } from './sa.users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersQueryRepository } from './users.query.repository';
import { BasicStrategy } from '../auth/passport/strategies/basic-strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './use-cases/create-user.use-case';

const adapters = [UsersRepository, UsersQueryRepository];
const strategies = [BasicStrategy];
const useCases = [CreateUserUseCase];

@Module({
	imports: [ConfigModule.forRoot(), CqrsModule],
	controllers: [SuperAdminUsersController],
	providers: [UsersService, ...adapters, ...strategies, ...useCases],
})
export class UsersModule {}
