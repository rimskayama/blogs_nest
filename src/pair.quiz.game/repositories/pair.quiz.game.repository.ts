import { InjectRepository } from '@nestjs/typeorm';
import { QuizQuestion } from '../domain/question.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QuestionViewDto } from '../quiz.types';
import { PublishInputModel, QuestionInputDto } from '../quiz.dto';

@Injectable()
export class QuizGameRepository {
	constructor(
		@InjectRepository(QuizQuestion)
		private readonly quizGameRepository: Repository<QuizQuestion>
	) {}

	async createQuestion(question: QuestionViewDto): Promise<QuestionViewDto> {
		try {
			const result = await this.quizGameRepository.save(question);
			return result;
		} catch (error) {
			console.error('Error creating question :', error);
		}
	}

	async updateQuestion(id: string, inputModel: QuestionInputDto): Promise<boolean> {
		try {
			const question = await this.quizGameRepository
				.createQueryBuilder('q')
				.where('q.id = :questionId', {
					questionId: id,
				})
				.getOne();

			question.body = inputModel.body;
			question.correctAnswers = inputModel.correctAnswers;
			question.updatedAt = new Date();

			await this.quizGameRepository.save(question);
			return true;
		} catch (error) {
			console.error('Error updating question:', error);
			return false;
		}
	}

	async publishQuestion(id: string, inputModel: PublishInputModel): Promise<boolean> {
		try {
			const question = await this.quizGameRepository
				.createQueryBuilder('q')
				.where('q.id = :questionId', {
					questionId: id,
				})
				.getOne();

			question.published = inputModel.published;
			question.updatedAt = new Date();

			await this.quizGameRepository.save(question);
			return true;
		} catch (error) {
			console.error('Error publishing question:', error);
			return false;
		}
	}

	async deleteQuestion(id: string): Promise<boolean> {
		try {
			const result = await this.quizGameRepository
				.createQueryBuilder('q')
				.delete()
				.from(QuizQuestion)
				.where('id = :questionId', { questionId: id })
				.execute();
			return result.affected === 1;
		} catch (error) {
			console.error('Error deleting question:', error);
			return false;
		}
	}
}
