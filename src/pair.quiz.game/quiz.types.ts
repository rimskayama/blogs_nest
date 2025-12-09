import { AnswerStatuses } from './domain/answer.entity';
import { GameStatuses } from './domain/game.entity';
import { QuizPlayer } from './domain/player.entity';
import { QuizQuestion } from './domain/question.entity';

export type QuestionViewDto = {
	id: string;
	body: string;
	correctAnswers: string[];
	published: boolean;
	createdAt: Date;
	updatedAt: Date | null;
};

export type GamePairViewModel = {
	id: string;
	firstPlayerProgress: GamePlayerProgressViewModel;
	secondPlayerProgress?: GamePlayerProgressViewModel | null;
	questions?: QuizQuestion[];
	status: GameStatuses;
	pairCreatedDate?: string;
	startGameDate?: string;
	finishGameDate?: string;
};

export type GamePlayerProgressViewModel = {
	answers: AnswerViewModel[] | [];
	player: PlayerViewModel;
	score: number | 0;
};

export type GamePlayerProgressDto = {
	answers: AnswerFromDB[] | [];
	player: PlayerViewModel;
	score: number | 0;
};

export type AnswerFromDB = {
	quizQuestion: QuizQuestion;
	answerStatus: AnswerStatuses;
	addedAt: Date;
};
export type AnswerViewModel = {
	questionId: string;
	answerStatus: AnswerStatuses;
	addedAt: string;
};

export type AnswerDto = {
	id: string;
	answerStatus: AnswerStatuses;
	quizPlayerId: string;
	quizQuestionId: string;
	quizGameId: string;
};

export type PlayerViewModel = {
	id: string;
	login: string;
};

export type GameDto = {
	id: string;
	status: GameStatuses;
	firstPlayerProgress: GamePlayerProgressDto;
	secondPlayerProgress?: GamePlayerProgressDto;
	questions: QuizQuestion[];
	pairCreatedDate: Date;
	startGameDate?: Date | null;
	finishGameDate?: Date | null;
};

export type CreateGameDto = {
	id: string;
	status: GameStatuses;
	pairCreatedDate: Date;
	startGameDate: Date | null;
	finishGameDate: Date | null;
	firstPlayer: QuizPlayer;
};

export type PlayerDto = {
	id: string;
	score: number | 0;
	gameId: string;
	userId: string;
	quizAnswer: [];
};

export type CurrentGameDto = {
	id: string;
	status: string;
	playerId: string;
};

export type AnswerViewDto = {
	questionId: string;
	answerStatus: string;
	addedAt: string;
};
