import { Test, type TestingModule } from '@nestjs/testing';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/app.settings';
import { v4 as uuidv4 } from 'uuid';

describe('PairQuizGameSAController (e2e)', () => {
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

		//console.log(q.body, 'list of question')

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
					updatedAt: expect.any(String),
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
});
