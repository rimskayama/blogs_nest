import { exceptionHandler } from '../exceptions/exception.handler';
import { questionIdField, questionNotFound, StatusCode } from '../exceptions/exception.constants';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth/passport/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { PublishInputModel, QuestionInputDto } from './quiz.dto';
import { CreateQuestionCommand } from './application/use-cases/create-question.use-case';
import { UpdateQuestionCommand } from './application/use-cases/update-question.use-case';
import { PublishQuestionCommand } from './application/use-cases/publish-question.use-case';
import { QueryParameters } from '../utils/pagination.types';
import { getPagination } from '../utils/pagination';
import { QuizGameQueryRepository } from './repositories/pair.quiz.game.query.repository';
import { DeleteQuestionCommand } from './application/use-cases/delete-question.use-case';

@Controller('sa/quiz/questions')
export class SuperAdminQuizGameController {
	constructor(
		private commandBus: CommandBus,
		private readonly quizGameQueryRepository: QuizGameQueryRepository
	) {}

	@UseGuards(BasicAuthGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	async getQuestions(@Query() query: QueryParameters) {
		const { page, limit, sortDirection, sortBy, searchBodyTerm } = getPagination(query);
		const result = await this.quizGameQueryRepository.findQuestions(page, limit, sortDirection, sortBy, searchBodyTerm);
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Get(':questionId')
	@HttpCode(HttpStatus.OK)
	async getQuestion(@Param('questionId') questionId: string) {
		const result = await this.quizGameQueryRepository.findQuestionById(questionId);
		if (result) {
			return result;
		} else return exceptionHandler(StatusCode.NotFound, questionNotFound, questionIdField);
	}

	@UseGuards(BasicAuthGuard)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createQuestion(@Body() inputModel: QuestionInputDto) {
		const result = await this.commandBus.execute(new CreateQuestionCommand(inputModel));
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Put(':questionId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateQuestion(@Body() inputModel: QuestionInputDto, @Param('questionId') questionId: string) {
		const result = await this.commandBus.execute(new UpdateQuestionCommand(questionId, inputModel));

		if (result.code !== StatusCode.Success) {
			return exceptionHandler(result.code, result.message, result.field);
		}
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Put(':questionId/publish')
	@HttpCode(HttpStatus.NO_CONTENT)
	async publishQuestion(@Body() inputModel: PublishInputModel, @Param('questionId') questionId: string) {
		const result = await this.commandBus.execute(new PublishQuestionCommand(questionId, inputModel));

		if (result.code !== StatusCode.Success) {
			return exceptionHandler(result.code, result.message, result.field);
		}
		return result;
	}

	@UseGuards(BasicAuthGuard)
	@Delete(':questionId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteBlog(@Param('questionId') questionId: string) {
		const result = await this.commandBus.execute(new DeleteQuestionCommand(questionId));
		if (result.code !== StatusCode.Success) {
			return exceptionHandler(result.code, result.message, result.field);
		}
		return result;
	}
}
