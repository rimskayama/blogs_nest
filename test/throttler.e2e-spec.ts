import { Test, type TestingModule } from '@nestjs/testing';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/app.settings';
import dotenv from 'dotenv';
dotenv.config();

//ERR 429

describe('Rate Limiting (e2e)', () => {
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

	it('should NOT register user, /auth/registration', async () => {
		const data = { password: 'qwerty', email: 'blabla', login: 'login' };
		//1
		await request(httpServer).post('/auth/registration').send(data).expect(HttpStatus.BAD_REQUEST);
		//2
		await request(httpServer).post('/auth/registration').send(data).expect(HttpStatus.BAD_REQUEST);
		//3
		await request(httpServer).post('/auth/registration').send(data).expect(HttpStatus.BAD_REQUEST);
		//4
		await request(httpServer).post('/auth/registration').send(data).expect(HttpStatus.BAD_REQUEST);
		//5
		await request(httpServer).post('/auth/registration').send(data).expect(HttpStatus.BAD_REQUEST);
		//6
		await request(httpServer).post('/auth/registration').send(data).expect(HttpStatus.TOO_MANY_REQUESTS);
	});

	it('should NOT accept confirmation code, /auth/registration-confirmation', async () => {
		const data = {
			code: 'code',
		};
		//1
		await request(httpServer).post('/auth/registration-confirmation').send(data).expect(HttpStatus.BAD_REQUEST);
		//2
		await request(httpServer).post('/auth/registration-confirmation').send(data).expect(HttpStatus.BAD_REQUEST);
		//3
		await request(httpServer).post('/auth/registration-confirmation').send(data).expect(HttpStatus.BAD_REQUEST);
		//4
		await request(httpServer).post('/auth/registration-confirmation').send(data).expect(HttpStatus.BAD_REQUEST);
		//5
		await request(httpServer).post('/auth/registration-confirmation').send(data).expect(HttpStatus.BAD_REQUEST);
		//6
		await request(httpServer).post('/auth/registration-confirmation').send(data).expect(HttpStatus.TOO_MANY_REQUESTS);
	});

	it('should NOT send email, /auth/registration-email-resending', async () => {
		//1
		await request(httpServer)
			.post('/auth/registration-email-resending')
			.send({ email: 'blabla' })
			.expect(HttpStatus.BAD_REQUEST);
		//2
		await request(httpServer)
			.post('/auth/registration-email-resending')
			.send({ email: 'blabla' })
			.expect(HttpStatus.BAD_REQUEST);
		//3
		await request(httpServer)
			.post('/auth/registration-email-resending')
			.send({ email: 'blabla' })
			.expect(HttpStatus.BAD_REQUEST);
		//4
		await request(httpServer)
			.post('/auth/registration-email-resending')
			.send({ email: 'blabla' })
			.expect(HttpStatus.BAD_REQUEST);
		//5
		await request(httpServer)
			.post('/auth/registration-email-resending')
			.send({ email: 'blabla' })
			.expect(HttpStatus.BAD_REQUEST);
		//6
		await request(httpServer)
			.post('/auth/registration-email-resending')
			.send({ email: 'blabla' })
			.expect(HttpStatus.TOO_MANY_REQUESTS);
	});

	it('should NOT login not existing user, /auth/login', async () => {
		const data = { password: 'qwerty5', loginOrEmail: 'login5' };

		//1
		await request(httpServer).post('/auth/login').send(data).expect(HttpStatus.UNAUTHORIZED);
		//2
		await request(httpServer).post('/auth/login').send(data).expect(HttpStatus.UNAUTHORIZED);
		//3
		await request(httpServer).post('/auth/login').send(data).expect(HttpStatus.UNAUTHORIZED);
		//4
		await request(httpServer).post('/auth/login').send(data).expect(HttpStatus.UNAUTHORIZED);
		//5
		await request(httpServer).post('/auth/login').send(data).expect(HttpStatus.UNAUTHORIZED);
		//6
		await request(httpServer).post('/auth/login').send(data).expect(HttpStatus.TOO_MANY_REQUESTS);
	});
});
