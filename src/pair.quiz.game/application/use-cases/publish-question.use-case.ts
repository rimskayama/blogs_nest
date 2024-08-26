import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishInputModel } from '../../../pair.quiz.game/quiz.dto';
import { exceptionResultType } from '../../../exceptions/exception.types';
import { questionIdField, questionNotFound, StatusCode } from '../../../exceptions/exception.constants';
import { QuizGameRepository } from '../../../pair.quiz.game/repositories/pair.quiz.game.repository';

export class PublishQuestionCommand {
	constructor(
		public id: string,
		public inputModel: PublishInputModel
	) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase implements ICommandHandler<PublishQuestionCommand> {
	constructor(private readonly quizQuestionsRepository: QuizGameRepository) {}
	async execute(command: PublishQuestionCommand): Promise<exceptionResultType | boolean> {
		const result = await this.quizQuestionsRepository.publishQuestion(command.id, command.inputModel);
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
