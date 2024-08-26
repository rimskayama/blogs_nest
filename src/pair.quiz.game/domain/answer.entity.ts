import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuizQuestion } from './question.entity';
import { QuizPlayer } from './player.entity';

@Entity('quizAnswers')
export class QuizAnswer {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar' })
	status: AnswerStatuses;

	@Column({ type: 'timestamp with time zone' })
	addedAt: Date;

	@ManyToOne(() => QuizQuestion, (quizQuestion) => quizQuestion.quizAnswer, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	quizQuestion: QuizQuestion;

	@ManyToOne(() => QuizPlayer, (quizPlayer) => quizPlayer.quizAnswer, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	quizPlayer: QuizPlayer;
}

export enum AnswerStatuses {
	Correct,
	Incorrect,
}
