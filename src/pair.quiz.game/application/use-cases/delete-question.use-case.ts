import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { exceptionResultType } from '../../../exceptions/exception.types';
import { questionIdField, questionNotFound, StatusCode } from '../../../exceptions/exception.constants';
import { QuizGameRepository } from '../../../pair.quiz.game/repositories/pair.quiz.game.repository';

export class DeleteQuestionCommand {
	constructor(public id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase implements ICommandHandler<DeleteQuestionCommand> {
	constructor(private readonly quizQuestionsRepository: QuizGameRepository) {}
	async execute(command: DeleteQuestionCommand): Promise<exceptionResultType | boolean> {
		const result = this.quizQuestionsRepository.deleteQuestion(command.id);
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
