import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SuperAdminUsersController } from './sa.users.controller';
import { UsersRepository } from './users.repository';
import { UsersQueryRepository } from './users.query.repository';
import { BasicStrategy } from '../auth/passport/strategies/basic-strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';

const adapters = [UsersRepository, UsersQueryRepository];
const strategies = [BasicStrategy];
const useCases = [CreateUserUseCase, DeleteUserUseCase];

@Module({
	imports: [ConfigModule.forRoot(), CqrsModule],
	controllers: [SuperAdminUsersController],
	providers: [...adapters, ...strategies, ...useCases],
})
export class UsersModule {}
