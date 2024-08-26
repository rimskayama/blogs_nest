import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuizAnswer } from './answer.entity';
import { QuizGame } from './game.entity';

@Entity('quizQuestions')
export class QuizQuestion {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar' })
	body: string;

	@Column({ type: 'varchar', array: true })
	correctAnswers: string[];

	@Column({ type: 'bool' })
	published: boolean;

	@Column({ type: 'timestamp with time zone' })
	createdAt: Date;

	@Column({ type: 'timestamp with time zone' })
	updatedAt: Date;

	@OneToMany(() => QuizAnswer, (quizAnswer) => quizAnswer.quizQuestion, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	quizAnswer: QuizAnswer;

	@ManyToOne(() => QuizGame, (quizGame) => quizGame.quizQuestion, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	quizGame: QuizGame;
}
