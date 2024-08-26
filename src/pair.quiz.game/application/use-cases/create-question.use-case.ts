import { v4 as uuidv4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionInputDto } from '../../../pair.quiz.game/quiz.dto';
import { QuizGameRepository } from '../../repositories/pair.quiz.game.repository';
import { QuestionViewDto } from '../../quiz.types';

export class CreateQuestionCommand {
	constructor(public inputModel: QuestionInputDto) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand> {
	constructor(private readonly quizQuestionsRepository: QuizGameRepository) {}
	async execute(command: CreateQuestionCommand): Promise<QuestionViewDto | boolean> {
		const newQuestion: QuestionViewDto = {
			id: uuidv4(),
			body: command.inputModel.body,
			correctAnswers: command.inputModel.correctAnswers,
			published: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		return this.quizQuestionsRepository.createQuestion(newQuestion);
	}
}
