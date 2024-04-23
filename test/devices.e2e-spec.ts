import { Test, type TestingModule } from '@nestjs/testing';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/app.settings';

describe('DevicesController (e2e)', () => {
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
	it('should create user for devices testing', async () => {
		const data = {
			password: 'qwerty1',
			email: 'rimskayama@outlook.com',
			login: 'login1',
		};

		const createResponse = await request(httpServer)
			.post('/sa/users')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.CREATED);

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
					login: 'login1',
					email: 'rimskayama@outlook.com',
					createdAt: expect.any(String),
				},
			],
		});
	});

	let accessToken = '';
	let refreshTokenOfSession1 = '';
	let refreshTokenOfSession3 = '';

	it('should login user: 1 session, Chrome', async () => {
		const data = {
			password: 'qwerty1',
			loginOrEmail: 'login1',
		};

		const createResponse = await request(httpServer)
			.post('/auth/login')
			.set('user-agent', 'Chrome')
			.send(data)
			.expect(HttpStatus.OK);

		accessToken = createResponse.body.accessToken;
		refreshTokenOfSession1 = createResponse.headers['set-cookie'][0];
	});

	it('should login user: 2 session, Android', async () => {
		const data = {
			password: 'qwerty1',
			loginOrEmail: 'login1',
		};

		const createResponse = await request(httpServer)
			.post('/auth/login')
			.set('user-agent', 'Android')
			.send(data)
			.expect(HttpStatus.OK);
	});

	it('should login user: 3 session, Firefox', async () => {
		const data = {
			password: 'qwerty1',
			loginOrEmail: 'login1',
		};

		const createResponse = await request(httpServer)
			.post('/auth/login')
			.set('user-agent', 'Firefox')
			.send(data)
			.expect(HttpStatus.OK);

		refreshTokenOfSession3 = createResponse.headers['set-cookie'][0];
	});

	it('should login user: 4 session, iPhone', async () => {
		const data = {
			password: 'qwerty1',
			loginOrEmail: 'login1',
		};

		const createResponse = await request(httpServer)
			.post('/auth/login')
			.set('user-agent', 'iPhone')
			.send(data)
			.expect(HttpStatus.OK);
	});

	let deviceIdOfUser1 = '';
	let lastActiveDateOfUser1 = '';
	it('should return all sessions of user №1', async () => {
		const createResponse = await request(httpServer)
			.get('/security/devices')
			.set('Cookie', refreshTokenOfSession1)
			.expect(HttpStatus.OK);

		expect(createResponse.body).toEqual([
			{
				ip: expect.any(String),
				title: 'Chrome',
				lastActiveDate: expect.any(String),
				deviceId: expect.any(String),
			},
			{
				ip: expect.any(String),
				title: 'Android',
				lastActiveDate: expect.any(String),
				deviceId: expect.any(String),
			},
			{
				ip: expect.any(String),
				title: 'Firefox',
				lastActiveDate: expect.any(String),
				deviceId: expect.any(String),
			},
			{
				ip: expect.any(String),
				title: 'iPhone',
				lastActiveDate: expect.any(String),
				deviceId: expect.any(String),
			},
		]);
		deviceIdOfUser1 = createResponse.body[1].deviceId;
		lastActiveDateOfUser1 = createResponse.body[1].lastActiveDate;
	});

	//ERR 404
	it('should NOT delete session, err 404', async () => {
		await request(httpServer)
			.delete('/security/devices/' + 'somewrongdeviceid')
			.set('Cookie', refreshTokenOfSession1)
			.expect(HttpStatus.NOT_FOUND);
	});

	//ERR 403

	let accessTokenOfUser2 = '';
	let refreshTokenOfUser2 = '';
	let createdUser2: any = { id: 0 };
	let deviceIdOfUser2 = '';
	it('should create user №2 for error 403 testing', async () => {
		const data = {
			password: 'qwerty2',
			email: 'emailofnewuser@outlook.com',
			login: 'login2',
		};

		const createResponse = await request(httpServer)
			.post('/sa/users')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.CREATED);

		createdUser2 = createResponse.body;
	});

	it('should login user №2 for testing', async () => {
		const data = {
			password: 'qwerty2',
			loginOrEmail: 'login2',
		};

		const createResponse = await request(httpServer)
			.post('/auth/login')
			.set('user-agent', 'iPhone')
			.send(data)
			.expect(HttpStatus.OK);

		accessTokenOfUser2 = createResponse.body.accessToken;
		refreshTokenOfUser2 = createResponse.headers['set-cookie'][0];
	});

	it('should return all sessions of user №2 to get deviceId', async () => {
		const createResponse = await request(httpServer)
			.get('/security/devices')
			.set('Cookie', refreshTokenOfUser2)
			.expect(HttpStatus.OK);

		expect(createResponse.body).toEqual([
			{
				ip: expect.any(String),
				title: 'iPhone',
				lastActiveDate: expect.any(String),
				deviceId: expect.any(String),
			},
		]);

		deviceIdOfUser2 = createResponse.body[0].deviceId;
	});
	it('should NOT delete session, err 401', async () => {
		await request(httpServer)
			.delete('/security/devices/' + deviceIdOfUser2)
			.expect(HttpStatus.UNAUTHORIZED);
	});
	it('should NOT delete session, err 403: deviceId of user №2, refreshToken of user №1', async () => {
		await request(httpServer)
			.delete('/security/devices/' + deviceIdOfUser2)
			.set('Cookie', refreshTokenOfSession1)
			.expect(HttpStatus.FORBIDDEN);
	});
	it('should return new refresh of user 1, session 1 Chrome', async () => {
		const createResponse = await request(httpServer)
			.post('/auth/refresh-token')
			.set('Cookie', refreshTokenOfSession1)
			.expect(HttpStatus.OK);

		refreshTokenOfSession1 = createResponse.headers['set-cookie'][0];
	});

	it('should return all sessions of user №1)', async () => {
		const createResponse = await request(httpServer)
			.get('/security/devices')
			.set('Cookie', refreshTokenOfSession1)
			.expect(HttpStatus.OK);
	});

	it('should delete session 2, refreshToken of session 1', async () => {
		await request(httpServer)
			.delete('/security/devices/' + deviceIdOfUser1)
			.set('Cookie', refreshTokenOfSession1)
			.expect(HttpStatus.NO_CONTENT);

		const b = await request(httpServer).get('/security/devices').set('Cookie', refreshTokenOfSession1).expect(200);

		expect(b.body).toEqual([
			{
				ip: expect.any(String),
				title: 'Firefox',
				lastActiveDate: expect.any(String),
				deviceId: expect.any(String),
			},
			{
				ip: expect.any(String),
				title: 'iPhone',
				lastActiveDate: expect.any(String),
				deviceId: expect.any(String),
			},
			{
				ip: expect.any(String),
				title: 'Chrome',
				lastActiveDate: expect.any(String),
				deviceId: expect.any(String),
			},
		]);
	});

	it('should logout user', async () => {
		const createResponse = await request(httpServer)
			.post('/auth/logout')
			.set('Cookie', refreshTokenOfSession3)
			.expect(HttpStatus.NO_CONTENT);

		const b = await request(httpServer).get('/security/devices').set('Cookie', refreshTokenOfSession1).expect(200);

		expect(b.body).toEqual([
			{
				ip: expect.any(String),
				title: 'iPhone',
				lastActiveDate: expect.any(String),
				deviceId: expect.any(String),
			},
			{
				ip: expect.any(String),
				title: 'Chrome',
				lastActiveDate: expect.any(String),
				deviceId: expect.any(String),
			},
		]);
	});

	it('should delete others sessions except Chrome, refreshToken of session 1', async () => {
		await request(httpServer)
			.delete('/security/devices/')
			.set('Cookie', refreshTokenOfSession1)
			.expect(HttpStatus.NO_CONTENT);

		const b = await request(httpServer)
			.get('/security/devices')
			.set('Cookie', refreshTokenOfSession1)
			.expect(HttpStatus.OK);

		expect(b.body).toEqual([
			{
				ip: expect.any(String),
				title: 'Chrome',
				lastActiveDate: expect.any(String),
				deviceId: expect.any(String),
			},
		]);
	});
});
