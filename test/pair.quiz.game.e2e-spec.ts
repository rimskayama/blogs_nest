import { Test, type TestingModule } from '@nestjs/testing';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/app.settings';
import { v4 as uuidv4 } from 'uuid';
import { AnswerStatuses } from '../src/pair.quiz.game/domain/answer.entity';

describe('PairQuizGameController (e2e)', () => {
	jest.setTimeout(100000);
	let app: INestApplication;
	let httpServer;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();

		appSettings(app);

		await app.init();

		httpServer = app.getHttpServer();

		await request(httpServer).delete('/testing/all-data');
	});

	//SA
	//GET
	it('should return 200 and quiz questions', async () => {
		await request(httpServer)
			.get('/sa/quiz/questions')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.OK, {
				pagesCount: 0,
				page: 1,
				pageSize: 10,
				totalCount: 0,
				items: [],
			});
	});

	it('should return 401', async () => {
		await request(httpServer).get('/sa/quiz/questions').expect(HttpStatus.UNAUTHORIZED);
	});

	//POST

	it('should return 401', async () => {
		await request(httpServer).post('/sa/quiz/questions').expect(HttpStatus.UNAUTHORIZED);
	});

	it('should NOT create question with incorrect input data', async () => {
		await request(httpServer)
			.post('/sa/quiz/questions')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send({
				body: 'stringstri',
			})
			.expect(HttpStatus.BAD_REQUEST);

		await request(httpServer)
			.get('/sa/quiz/questions')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.OK, {
				pagesCount: 0,
				page: 1,
				pageSize: 10,
				totalCount: 0,
				items: [],
			});
	});

	let createdQuestion1 = { id: uuidv4() };

	it('should create question with correct input data', async () => {
		const data = {
			body: 'stringstring',
			correctAnswers: ['string'],
		};
		const createResponse = await request(httpServer)
			.post('/sa/quiz/questions')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.CREATED);

		createdQuestion1 = createResponse.body;
		//console.log(createdQuestion1);

		const q = await request(httpServer)
			.get('/sa/quiz/questions')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.OK);

		expect(q.body).toEqual({
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			totalCount: 1,
			items: [
				{
					id: createdQuestion1.id,
					body: 'stringstring',
					correctAnswers: ['string'],
					published: false,
					createdAt: expect.any(String),
					updatedAt: null,
				},
			],
		});
	});

	//PUT

	it('should NOT update question without correctAnswers', async () => {
		const data = {
			body: 'stringstri',
		};

		await request(httpServer)
			.put('/sa/quiz/questions/' + createdQuestion1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.BAD_REQUEST, {
				errorsMessages: [
					{
						message: 'each value in correctAnswers must be a string',
						field: 'correctAnswers',
					},
					{
						message: 'correctAnswers must contain at least 1 elements',
						field: 'correctAnswers',
					},
					{
						message: 'correctAnswers must be an array',
						field: 'correctAnswers',
					},
				],
			});
	});

	it('should NOT update question that does not exist', async () => {
		await request(httpServer)
			.put('/sa/quiz/questions/' + '642681e8ad245fa9580960f8')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send({
				body: 'new body new body',
				correctAnswers: ['new answer'],
			})
			.expect(HttpStatus.NOT_FOUND);
	});

	it('should update question with correct input data', async () => {
		const data = {
			body: 'new body new body',
			correctAnswers: ['new answer'],
		};

		await request(httpServer)
			.put('/sa/quiz/questions/' + createdQuestion1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.NO_CONTENT);

		const q = await request(httpServer)
			.get('/sa/quiz/questions/' + createdQuestion1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.OK);

		expect(q.body).toEqual({
			id: expect.any(String),
			body: 'new body new body',
			correctAnswers: ['new answer'],
			published: false,
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});

	//PUBLISH

	it('should NOT publish question, 401', async () => {
		const data = {
			published: true,
		};
		await request(httpServer)
			.put('/sa/quiz/questions/' + createdQuestion1.id + '/publish')
			.send(data)
			.expect(HttpStatus.UNAUTHORIZED);
	});

	it('should NOT publish question without correct data', async () => {
		const data = {
			published: 'string',
		};
		await request(httpServer)
			.put('/sa/quiz/questions/' + createdQuestion1.id + '/publish')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.BAD_REQUEST);
	});

	it('should publish question', async () => {
		const data = {
			published: true,
		};

		await request(httpServer)
			.put('/sa/quiz/questions/' + createdQuestion1.id + '/publish')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.NO_CONTENT);

		const q = await request(httpServer)
			.get('/sa/quiz/questions/' + createdQuestion1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.OK);

		expect(q.body).toEqual({
			id: expect.any(String),
			body: 'new body new body',
			correctAnswers: ['new answer'],
			published: true,
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});

	it('should unpublish question', async () => {
		const data = {
			published: false,
		};

		await request(httpServer)
			.put('/sa/quiz/questions/' + createdQuestion1.id + '/publish')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.NO_CONTENT);

		const q = await request(httpServer)
			.get('/sa/quiz/questions/' + createdQuestion1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.OK);

		expect(q.body).toEqual({
			id: expect.any(String),
			body: 'new body new body',
			correctAnswers: ['new answer'],
			published: false,
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});

	//DELETE
	it('should delete question', async () => {
		await request(httpServer)
			.delete('/sa/quiz/questions/' + createdQuestion1.id)
			.expect(HttpStatus.UNAUTHORIZED);

		await request(httpServer)
			.delete('/sa/quiz/questions/' + createdQuestion1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.NO_CONTENT);

		await request(httpServer)
			.get('/sa/quiz/questions/' + createdQuestion1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.NOT_FOUND);

		await request(httpServer)
			.get('/sa/quiz/questions')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.OK, {
				pagesCount: 0,
				page: 1,
				pageSize: 10,
				totalCount: 0,
				items: [],
			});
	});

	//CREATE GAME QUESTIONS
	const questionsToPost = [
		{
			body: `console.log(+true)
				console.log(!"John")`,
			correctAnswers: ['1 false'],
		},
		{
			body: `
			let number = 0
			console.log(number++)
			console.log(++number)
			console.log(number)`,
			correctAnswers: ['0 2 2'],
		},
		{
			body: `
			function getAge(...args) {
  			console.log(typeof args)
			}

			getAge(30)`,
			correctAnswers: ['object'],
		},
		{
			body: `
			for (let i = 1; i < 5; i++) {
  			if (i === 3) continue
  			console.log(i)
			}`,
			correctAnswers: ['1 2 4'],
		},
		{
			body: `
			console.log(typeof typeof 1)
			}`,
			correctAnswers: ['string'],
		},
	];

	it('should create questions with correct input data', async () => {
		for (let i = 0; i < questionsToPost.length; i++) {
			await request(httpServer)
				.post('/sa/quiz/questions')
				.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
				.send(questionsToPost[i])
				.expect(HttpStatus.CREATED);
		}
	});
	let ids;
	let questions;
	it('should return questions', async () => {
		const q = await request(httpServer)
			.get('/sa/quiz/questions')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.OK);

		expect(q.body).toEqual({
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			totalCount: 5,
			items: expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(typeof typeof 1`),
					correctAnswers: expect.arrayContaining(['string']),
					published: false,
					createdAt: expect.any(String),
					updatedAt: null,
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`let number = 0`),
					correctAnswers: expect.arrayContaining(['0 2 2']),
					published: false,
					createdAt: expect.any(String),
					updatedAt: null,
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`for (let i = 1; i < 5; i++)`),
					correctAnswers: expect.arrayContaining(['1 2 4']),
					published: false,
					createdAt: expect.any(String),
					updatedAt: null,
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(+true)`),
					correctAnswers: expect.arrayContaining(['1 false']),
					published: false,
					createdAt: expect.any(String),
					updatedAt: null,
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`function getAge(...args)`),
					correctAnswers: expect.arrayContaining(['object']),
					published: false,
					createdAt: expect.any(String),
					updatedAt: null,
				}),
			]),
		});
		questions = q.body.items;
		ids = q.body.items.map((question) => question.id);
	});

	it('should publish questions', async () => {
		for (let i = 0; i < ids.length; i++) {
			await request(httpServer)
				.put('/sa/quiz/questions/' + ids[i] + '/publish')
				.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
				.send({
					published: true,
				})
				.expect(HttpStatus.NO_CONTENT);
		}
	});

	//USER
	//GET

	//POST auth/registration
	const createdUser1: any = { id: 0 };
	it('should create user 1 for pair quiz game testing', async () => {
		const data = {
			password: 'qwerty1',
			email: 'rimskayama@outlook.com',
			login: 'login1',
		};

		await request(httpServer)
			.post('/sa/users')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.CREATED);
	});

	// POST auth/login -> get accessToken

	let accessToken1 = '';
	let userId1;
	it('should login user 1', async () => {
		const data = {
			password: 'qwerty1',
			loginOrEmail: 'login1',
		};

		const createResponse = await request(httpServer).post('/auth/login').send(data).expect(HttpStatus.OK);

		accessToken1 = createResponse.body.accessToken;
		//userId1 = createResponse.body;
		console.log(createResponse.body);
	});

	//GET
	it('should not return current unfinished user 1 game, 401', async () => {
		await request(httpServer).get('/pair-game-quiz/pairs/my-current').expect(HttpStatus.UNAUTHORIZED);
	});

	it('should not return current unfinished user 1 game if no active pair for current user, 404', async () => {
		await request(httpServer)
			.get('/pair-game-quiz/pairs/my-current')
			.set('Authorization', `Bearer ${accessToken1}`)
			.expect(HttpStatus.NOT_FOUND);
	});

	//POST CONNECTION 1 USER
	it('should return status 401', async () => {
		await request(httpServer).post('/pair-game-quiz/pairs/connection').expect(HttpStatus.UNAUTHORIZED);
	});

	let gameId;
	it('should return new pair with status "PendingSecondPlayer", 200', async () => {
		const g = await request(httpServer)
			.post('/pair-game-quiz/pairs/connection')
			.set('Authorization', `Bearer ${accessToken1}`)
			.expect(HttpStatus.OK);

		expect(g.body).toEqual({
			id: expect.any(String),
			firstPlayerProgress: {
				answers: [],
				player: {
					id: expect.any(String),
					login: 'login1',
				},
				score: 0,
			},
			startGameDate: null,
			finishGameDate: null,
			questions: null,
			secondPlayerProgress: null,
			status: 'PendingSecondPlayer',
			pairCreatedDate: expect.any(String),
		});
		gameId = g.body.id;
	});

	it('should return game without second player, 200', async () => {
		const g = await request(httpServer)
			.get('/pair-game-quiz/pairs/' + gameId)
			.set('Authorization', `Bearer ${accessToken1}`)
			.expect(HttpStatus.OK);

		expect(g.body).toEqual({
			id: expect.any(String),
			firstPlayerProgress: {
				answers: [],
				player: {
					id: expect.any(String),
					login: 'login1',
				},
				score: 0,
			},
			questions: null,
			secondPlayerProgress: null,
			startGameDate: null,
			status: 'PendingSecondPlayer',
			pairCreatedDate: expect.any(String),
			finishGameDate: null,
		});
	});

	//CREATE USER 2
	//POST auth/registration
	const createdUser2: any = { id: 1 };
	it('should create user 2 for pair quiz game testing', async () => {
		const data = {
			password: 'qwerty1',
			email: 'newuser@outlook.com',
			login: 'login2',
		};

		const createResponse = await request(httpServer)
			.post('/sa/users')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.CREATED);
	});

	// // POST auth/login -> get accessToken

	let accessToken2 = '';
	it('should login user 2', async () => {
		const data = {
			password: 'qwerty1',
			loginOrEmail: 'login2',
		};

		const createResponse = await request(httpServer).post('/auth/login').send(data).expect(HttpStatus.OK);

		accessToken2 = createResponse.body.accessToken;
	});

	//POST CONNECTION 2 USER

	it('should return started existing pair, 200', async () => {
		const q = await request(httpServer)
			.post('/pair-game-quiz/pairs/connection')
			.set('Authorization', `Bearer ${accessToken2}`)
			.expect(HttpStatus.OK);

		expect(q.body).toEqual({
			id: expect.any(String),
			firstPlayerProgress: {
				answers: [],
				player: {
					id: expect.any(String),
					login: 'login1',
				},
				score: 0,
			},
			secondPlayerProgress: {
				answers: [],
				player: {
					id: expect.any(String),
					login: 'login2',
				},
				score: 0,
			},
			questions: expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(typeof typeof 1`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`let number = 0`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`for (let i = 1; i < 5; i++)`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(+true)`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`function getAge(...args)`),
				}),
			]),
			status: 'Active',
			pairCreatedDate: expect.any(String),
			startGameDate: expect.any(String),
			finishGameDate: null,
		});
		//new random order
		questions = q.body.questions;
		ids = questions.map((question) => question.id);
	});

	let answers;
	it('should return questions by id for answers testing', async () => {
		let q;
		const questionsWithAnswers = [];
		for (let i = 0; i < ids.length; i++) {
			q = await request(httpServer)
				.get('/sa/quiz/questions/' + ids[i])
				.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
				.expect(HttpStatus.OK);
			questionsWithAnswers.push(q.body);
		}
		answers = questionsWithAnswers.map((question) => ({
			answer: question.correctAnswers[0],
		}));
	});

	it('should return game with second player, 200', async () => {
		const g = await request(httpServer)
			.get('/pair-game-quiz/pairs/' + gameId)
			.set('Authorization', `Bearer ${accessToken1}`)
			.expect(HttpStatus.OK);

		expect(g.body).toEqual({
			id: expect.any(String),
			firstPlayerProgress: {
				answers: [],
				player: {
					id: expect.any(String),
					login: 'login1',
				},
				score: 0,
			},
			secondPlayerProgress: {
				answers: [],
				player: {
					id: expect.any(String),
					login: 'login2',
				},
				score: 0,
			},
			finishGameDate: null,
			questions: expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(typeof typeof 1`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`let number = 0`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`for (let i = 1; i < 5; i++)`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(+true)`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`function getAge(...args)`),
				}),
			]),
			status: 'Active',
			pairCreatedDate: expect.any(String),
			startGameDate: expect.any(String),
		});
	});
	it('should return status 403 if current user is already participating in active pair', async () => {
		const q = await request(httpServer)
			.post('/pair-game-quiz/pairs/connection')
			.set('Authorization', `Bearer ${accessToken1}`)
			.expect(HttpStatus.FORBIDDEN);
	});

	it('should return current unfinished user game', async () => {
		const g = await request(httpServer)
			.get('/pair-game-quiz/pairs/my-current')
			.set('Authorization', `Bearer ${accessToken1}`)
			.expect(HttpStatus.OK);

		expect(g.body).toEqual({
			id: expect.any(String),
			firstPlayerProgress: {
				answers: [],
				player: {
					id: expect.any(String),
					login: 'login1',
				},
				score: 0,
			},
			questions: null,
			secondPlayerProgress: null,
			startGameDate: null,
			status: 'PendingSecondPlayer',
			pairCreatedDate: expect.any(String),
			finishGameDate: null,
		});
	});

	it('should return 401 if unauthorised user gives answers', async () => {
		for (let i = 0; i < questions.length - 1; i++) {
			await request(httpServer)
				.post('/pair-game-quiz/pairs/my-current/answers')
				.send(answers[i])
				.expect(HttpStatus.UNAUTHORIZED);
		}
	});

	it('user1 should give answers', async () => {
		for (let i = 0; i < questions.length - 2; i++) {
			await request(httpServer)
				.post('/pair-game-quiz/pairs/my-current/answers')
				.set('Authorization', `Bearer ${accessToken1}`)
				.send(answers[i])
				.expect(HttpStatus.OK);
		}
	});

	it('user2 should give answers', async () => {
		for (let i = 0; i < questions.length - 2; i++) {
			await request(httpServer)
				.post('/pair-game-quiz/pairs/my-current/answers')
				.set('Authorization', `Bearer ${accessToken2}`)
				.send(answers[i])
				.expect(HttpStatus.OK);
		}
	});

	it('should return current unfinished user game', async () => {
		const g = await request(httpServer)
			.get('/pair-game-quiz/pairs/my-current')
			.set('Authorization', `Bearer ${accessToken1}`)
			.expect(HttpStatus.OK);

		expect(g.body).toEqual({
			id: expect.any(String),
			firstPlayerProgress: {
				answers: expect.arrayContaining([
					expect.objectContaining({
						questionId: ids[0],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[1],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[2],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
				]),
				player: {
					id: expect.any(String),
					login: 'login1',
				},
				score: 3,
			},
			secondPlayerProgress: {
				answers: expect.arrayContaining([
					expect.objectContaining({
						questionId: ids[0],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[1],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[2],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
				]),
				player: {
					id: expect.any(String),
					login: 'login2',
				},
				score: 3,
			},
			questions: expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(typeof typeof 1`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`let number = 0`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`for (let i = 1; i < 5; i++)`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(+true)`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`function getAge(...args)`),
				}),
			]),
			status: 'Active',
			pairCreatedDate: expect.any(String),
			startGameDate: expect.any(String),
			finishGameDate: null,
		});
	});

	it('user2 should give right answer', async () => {
		await request(httpServer)
			.post('/pair-game-quiz/pairs/my-current/answers')
			.set('Authorization', `Bearer ${accessToken2}`)
			.send(answers[3])
			.expect(HttpStatus.OK);
	});

	it('user1 should give wrong answer', async () => {
		const data = {
			answer: 'wrong answer',
		};
		await request(httpServer)
			.post('/pair-game-quiz/pairs/my-current/answers')
			.set('Authorization', `Bearer ${accessToken1}`)
			.send(data)
			.expect(HttpStatus.OK);
	});

	it('should return current unfinished user game', async () => {
		const g = await request(httpServer)
			.get('/pair-game-quiz/pairs/my-current')
			.set('Authorization', `Bearer ${accessToken1}`)
			.expect(HttpStatus.OK);

		expect(g.body).toEqual({
			id: expect.any(String),
			firstPlayerProgress: {
				answers: expect.arrayContaining([
					expect.objectContaining({
						questionId: ids[0],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[1],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[2],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[3],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Incorrect,
					}),
				]),
				player: {
					id: expect.any(String),
					login: 'login1',
				},
				score: 3,
			},
			secondPlayerProgress: {
				answers: expect.arrayContaining([
					expect.objectContaining({
						questionId: ids[0],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[1],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[2],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[3],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
				]),
				player: {
					id: expect.any(String),
					login: 'login2',
				},
				score: 4,
			},
			questions: expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(typeof typeof 1`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`let number = 0`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`for (let i = 1; i < 5; i++)`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(+true)`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`function getAge(...args)`),
				}),
			]),
			status: 'Active',
			pairCreatedDate: expect.any(String),
			startGameDate: expect.any(String),
			finishGameDate: null,
		});
	});

	it('user2 should give right answer', async () => {
		await request(httpServer)
			.post('/pair-game-quiz/pairs/my-current/answers')
			.set('Authorization', `Bearer ${accessToken2}`)
			.send(answers[4])
			.expect(HttpStatus.OK);
	});

	it('should return 403 if user is in active pair but has already answered to all questions', async () => {
		for (let i = 0; i < questions.length - 1; i++) {
			await request(httpServer)
				.post('/pair-game-quiz/pairs/my-current/answers')
				.set('Authorization', `Bearer ${accessToken2}`)
				.send(answers[i])
				.expect(HttpStatus.FORBIDDEN);
		}
	});

	it('should not return 404 if no active pair for current user', async () => {
		await request(httpServer)
			.get('/pair-game-quiz/pairs/my-current')
			.set('Authorization', `Bearer ${accessToken1}`)
			.expect(HttpStatus.NOT_FOUND);
	});

	it('should return current game with status Finished and finishGameDate, 200', async () => {
		const g = await request(httpServer)
			.get('/pair-game-quiz/pairs/' + gameId)
			.set('Authorization', `Bearer ${accessToken1}`)
			.expect(HttpStatus.OK);

		expect(g.body).toEqual({
			id: expect.any(String),
			firstPlayerProgress: {
				answers: expect.arrayContaining([
					expect.objectContaining({
						questionId: ids[0],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[1],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[2],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[3],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Incorrect,
					}),
				]),
				player: {
					id: expect.any(String),
					login: 'login1',
				},
				score: 3,
			},
			secondPlayerProgress: {
				answers: expect.arrayContaining([
					expect.objectContaining({
						questionId: ids[0],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[1],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[2],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[3],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
					expect.objectContaining({
						questionId: ids[4],
						addedAt: expect.any(String),
						answerStatus: AnswerStatuses.Correct,
					}),
				]),
				player: {
					id: expect.any(String),
					login: 'login2',
				},
				score: 5,
			},
			questions: expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(typeof typeof 1`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`let number = 0`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`for (let i = 1; i < 5; i++)`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`console.log(+true)`),
				}),
				expect.objectContaining({
					id: expect.any(String),
					body: expect.stringContaining(`function getAge(...args)`),
				}),
			]),
			status: 'Finished',
			pairCreatedDate: expect.any(String),
			startGameDate: expect.any(String),
			finishGameDate: expect.any(String),
		});
	});

	//403 THIRD USER
	//CREATE USER 3
	//POST auth/registration
	// const createdUser3: any = { id: 2 };
	// it('should create user 3 for 403 error testing', async () => {
	// 	const data = {
	// 		password: 'qwerty1',
	// 		email: 'thirduser@outlook.com',
	// 		login: 'login3',
	// 	};

	// 	const createResponse = await request(httpServer)
	// 		.post('/sa/users')
	// 		.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
	// 		.send(data)
	// 		.expect(HttpStatus.CREATED);
	// });

	// // // POST auth/login -> get accessToken

	// let accessToken3 = '';
	// it('should login user 3', async () => {
	// 	const data = {
	// 		password: 'qwerty1',
	// 		loginOrEmail: 'login3',
	// 	};

	// 	const createResponse = await request(httpServer).post('/auth/login').send(data).expect(HttpStatus.OK);

	// 	accessToken3 = createResponse.body.accessToken;
	// });

	// it('should return 403 if current user is not inside active pair', async () => {
	// 	for (let i = 0; i < questions.length - 2; i++) {
	// 		await request(httpServer)
	// 			.post('/pair-game-quiz/pairs/my-current/answers')
	// 			.set('Authorization', `Bearer ${accessToken3}`)
	// 			.send(answers[i])
	// 			.expect(HttpStatus.FORBIDDEN);
	// 	}
	// });

	// //третий игрок 403 getGame двух других игроков
	// it('should not return game if user is not player, 403', async () => {
	// 	const g = await request(httpServer)
	// 		.get('/pair-game-quiz/pairs/' + gameId)
	// 		.set('Authorization', `Bearer ${accessToken3}`)
	// 		.expect(HttpStatus.FORBIDDEN);
	// });

	// //START NEW GAME
	// let newGameId;
	// it('connection, should return new pair with status "PendingSecondPlayer", 200', async () => {
	// 	const g = await request(httpServer)
	// 		.post('/pair-game-quiz/pairs/connection')
	// 		.set('Authorization', `Bearer ${accessToken1}`)
	// 		.expect(HttpStatus.OK);

	// 	expect(g.body).toEqual({
	// 		id: expect.any(String),
	// 		firstPlayerProgress: {
	// 			answers: [],
	// 			player: {
	// 				id: expect.any(String),
	// 				login: 'login1',
	// 			},
	// 			score: 0,
	// 		},
	// 		startGameDate: null,
	// 		finishGameDate: null,
	// 		questions: null,
	// 		secondPlayerProgress: null,
	// 		status: 'PendingSecondPlayer',
	// 		pairCreatedDate: expect.any(String),
	// 	});
	// 	newGameId = g.body.id;
	// });

	// it('should return game without second player, 200', async () => {
	// 	const g = await request(httpServer)
	// 		.get('/pair-game-quiz/pairs/' + newGameId)
	// 		.set('Authorization', `Bearer ${accessToken1}`)
	// 		.expect(HttpStatus.OK);

	// 	expect(g.body).toEqual({
	// 		id: expect.any(String),
	// 		firstPlayerProgress: {
	// 			answers: [],
	// 			player: {
	// 				id: expect.any(String),
	// 				login: 'login1',
	// 			},
	// 			score: 0,
	// 		},
	// 		questions: null,
	// 		secondPlayerProgress: null,
	// 		startGameDate: null,
	// 		status: 'PendingSecondPlayer',
	// 		pairCreatedDate: expect.any(String),
	// 		finishGameDate: null,
	// 	});
	// });

	// it('should return current unfinished user game', async () => {
	// 	const g = await request(httpServer)
	// 		.get('/pair-game-quiz/pairs/my-current')
	// 		.set('Authorization', `Bearer ${accessToken1}`)
	// 		.expect(HttpStatus.NOT_FOUND);
	// });
});
