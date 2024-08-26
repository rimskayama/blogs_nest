import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionInputDto } from '../../../pair.quiz.game/quiz.dto';
import { exceptionResultType } from '../../../exceptions/exception.types';
import { questionIdField, questionNotFound, StatusCode } from '../../../exceptions/exception.constants';
import { QuizGameRepository } from '../../../pair.quiz.game/repositories/pair.quiz.game.repository';

export class UpdateQuestionCommand {
	constructor(
		public id: string,
		public inputModel: QuestionInputDto
	) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand> {
	constructor(private readonly quizGameRepository: QuizGameRepository) {}
	async execute(command: UpdateQuestionCommand): Promise<exceptionResultType | boolean> {
		const result = await this.quizGameRepository.updateQuestion(command.id, command.inputModel);
		if (!result) {
			return {
				code: StatusCode.NotFound,
				field: questionIdField,
				message: questionNotFound,
			};
		}
		return {
			code: StatusCode.Success,
		};
	}
}
