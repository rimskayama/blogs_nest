import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BasicStrategy } from '../auth/passport/strategies/basic-strategy';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminQuizGameController } from './sa.pair.quiz.game.controller';
import { QuizQuestion } from './domain/question.entity';
import { QuizAnswer } from './domain/answer.entity';
import { CreateQuestionUseCase } from './application/use-cases/create-question.use-case';
import { UpdateQuestionUseCase } from './application/use-cases/update-question.use-case';
import { PublishQuestionUseCase } from './application/use-cases/publish-question.use-case';
import { DeleteQuestionUseCase } from './application/use-cases/delete-question.use-case';
import { QuizGameQueryRepository } from './repositories/pair.quiz.game.query.repository';
import { QuizGameRepository } from './repositories/pair.quiz.game.repository';

const adapters = [QuizGameQueryRepository, QuizGameRepository];
const strategies = [BasicStrategy];
const useCases = [CreateQuestionUseCase, UpdateQuestionUseCase, PublishQuestionUseCase, DeleteQuestionUseCase];

@Module({
	imports: [
		ConfigModule.forRoot(),
		PassportModule,
		CqrsModule,
		TypeOrmModule.forFeature([QuizQuestion]),
		TypeOrmModule.forFeature([QuizAnswer]),
	],
	controllers: [SuperAdminQuizGameController],
	providers: [...adapters, ...strategies, ...useCases],
})
export class PairQuizGameModule {}
