import { Test, type TestingModule } from '@nestjs/testing';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/app.settings';

describe('UsersController (e2e)', () => {
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

	//GET
	it('should return 200 and users', async () => {
		await request(httpServer).get('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatus.OK, {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		});
	});

	it('should return 404 for not existing user', async () => {
		await request(httpServer)
			.get('/sa/users/6413437e44902b9011d0b316')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(404);
	});

	// POST

	let createdUser1: any = { id: 0 };

	it('should NOT create user with incorrect login', async () => {
		const data = {
			login: '12345678910',
			password: 'string',
			email: 'asdfg@gmail.com',
		};
		await request(httpServer).post('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(data).expect(400);

		await request(httpServer).get('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(200, {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		});
	});

	it('should create user with correct input data', async () => {
		const data = {
			login: 'login',
			password: 'string',
			email: 'asdfg@gmail.com',
		};
		const createResponse = await request(httpServer)
			.post('/sa/users')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(201);

		createdUser1 = createResponse.body;

		const b = await request(httpServer).get('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(200);

		expect(b.body).toEqual({
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			totalCount: 1,
			items: [
				{
					id: expect.any(String),
					login: createdUser1.login,
					email: createdUser1.email,
					createdAt: expect.any(String),
				},
			],
		});
	});

	//DELETE

	it('should NOT delete user that not exist', async () => {
		await request(httpServer)
			.delete('/sa/users/' + '6426b691b5ac688d25825932')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(404);
	});

	it('should delete user', async () => {
		await request(httpServer)
			.delete('/sa/users/' + createdUser1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(204);

		await request(httpServer)
			.get('/sa/users/' + createdUser1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(404);

		await request(httpServer).get('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(200, {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		});
	});
});
