import { Test, type TestingModule } from '@nestjs/testing';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/app.settings';

describe('AuthController (e2e)', () => {
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

	let createdUser1: any = { id: 0 };
	it('should create user with confirmed email', async () => {
		const data = { password: 'qwerty1', email: 'rimskayama@outlook.com', login: 'login1' };

		const createResponse = await request(httpServer)
			.post('/users')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.CREATED);

		createdUser1 = createResponse.body;

		const b = await request(httpServer).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(200);

		expect(b.body).toEqual({
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			totalCount: 1,
			items: [
				{
					id: expect.any(String),
					login: 'login1',
					email: 'rimskayama@outlook.com',
					createdAt: expect.any(String),
				},
			],
		});
	});

	// POST auth/login -> get accessToken

	let accessToken = '';
	let refreshToken = '';

	it('should login user', async () => {
		const data = { password: 'qwerty1', loginOrEmail: 'login1' };

		const createResponse = await request(httpServer).post('/auth/login').send(data).expect(200);

		accessToken = createResponse.body.accessToken;
		refreshToken = createResponse.headers['set-cookie'][0];
	});

	it('should get info about user', async () => {
		await request(httpServer)
			.get('/auth/me')
			.set('Cookie', refreshToken)
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200, {
				userId: createdUser1.id,
				login: 'login1',
				email: 'rimskayama@outlook.com',
			});
	});

	it('should return new refresh and access tokens', async () => {
		const createResponse = await request(httpServer)
			.post('/auth/refresh-token')
			.set('Cookie', refreshToken)
			.expect(200);

		refreshToken = createResponse.headers['set-cookie'][0];
		accessToken = createResponse.body.accessToken;

		await request(httpServer)
			.get('/auth/me')
			.set('Authorization', `Bearer ${accessToken}`)
			.set('Cookie', refreshToken)
			.expect(200);
	});

	it('should logout user', async () => {
		await request(httpServer).post('/auth/logout').set('Cookie', refreshToken).expect(204);

		await request(httpServer)
			.get('/auth/me')
			.set('Cookie', refreshToken)
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(401);
	});

	//registration of user 2
	let createdUser2: any = { id: 1 };

	it('should register the user', async () => {
		const data = { login: 'login', password: 'qwertyyy', email: 'rimskaya.mary@yandex.ru' };

		const createResponse = await request(httpServer).post('/auth/registration/').send(data).expect(204);
		createdUser2 = createResponse.body;
	});

	it('should not let user register if user with email that already exists', async () => {
		const data = { login: 'login', password: 'qwertyyy', email: 'rimskaya.mary@yandex.ru' };
		await request(httpServer)
			.post('/auth/registration')
			.send(data)
			.expect(400, {
				errorsMessages: [
					{ message: 'User with that login already exists', field: 'login' },
					{ message: 'User with that email already exists', field: 'email' },
				],
			});
	});

	it('should send confirmation mail', async () => {
		const data = {
			email: 'useremail@outlook.com',
		};
		await request(httpServer).post('/auth/registration-email-resending').send(data).expect(204);
	});

	it('should not let user resend mail if email is already confirmed', async () => {
		const data = {
			email: 'rimskayama@outlook.com',
		};
		await request(httpServer)
			.post('/auth/registration-email-resending')
			.send(data)
			.expect(400, {
				errorsMessages: [
					{
						message: 'Your email was already confirmed',
						field: 'email',
					},
				],
			});
	});
});
