import { Test, type TestingModule } from '@nestjs/testing';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/app.settings';

describe('BlogsController (e2e)', () => {
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
	it('should return 200 and blogs', async () => {
		await request(httpServer).get('/blogs').expect(HttpStatus.OK, {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		});
	});

	it('should return 404 for not existing blogs', async () => {
		await request(httpServer)
			.get('/blogs/6413437e44902b9011d0b316')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.NOT_FOUND);
	});

	//POST

	it('should NOT create blog with incorrect input data', async () => {
		await request(httpServer)
			.post('/sa/blogs')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send({
				name: 'veryveryverylongname234',
				description: 'string',
				websiteUrl: 'string',
			})
			.expect(HttpStatus.BAD_REQUEST);

		await request(httpServer).get('/blogs').expect(HttpStatus.OK, {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		});
	});

	let createdBlog1 = { id: 0 };

	it('should create blog with correct input data', async () => {
		const data = {
			name: 'string',
			description: 'string',
			websiteUrl: 'https://www.base64encode.org/',
		};
		const createResponse = await request(httpServer)
			.post('/sa/blogs')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.CREATED);

		createdBlog1 = createResponse.body;
		//console.log(createdBlog1);

		const b = await request(httpServer).get('/blogs').expect(HttpStatus.OK);

		//console.log(b.body, 'list of blogs')

		expect(b.body).toEqual({
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			totalCount: 1,
			items: [
				{
					id: expect.any(String),
					name: 'string',
					description: 'string',
					websiteUrl: 'https://www.base64encode.org/',
					isMembership: false,
					createdAt: expect.any(String),
				},
			],
		});
	});

	//PUT

	it('should NOT update blog with incorrect name', async () => {
		const data = {
			name: 'veryverylongname',
			description: 'new description',
			websiteUrl: 'https://vercel.com/',
		};

		await request(httpServer)
			.put('/sa/blogs/' + createdBlog1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.BAD_REQUEST, {
				errorsMessages: [
					{
						message: 'name must be shorter than or equal to 15 characters',
						field: 'name',
					},
				],
			});

		//console.log(createdBlog1)
	});

	it('should NOT update blog that not exist', async () => {
		await request(httpServer)
			.put('/sa/blogs/' + '642681e8ad245fa9580960f8')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send({
				name: 'new name',
				description: 'new description',
				websiteUrl: 'https://vercel.com/',
			})
			.expect(HttpStatus.NOT_FOUND);
	});

	//console.log(createdBlog1)

	it('should update blog with correct input data', async () => {
		const data = {
			name: 'new name',
			description: 'new description',
			websiteUrl: 'https://vercel.com/',
		};

		await request(httpServer)
			.put('/sa/blogs/' + createdBlog1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(HttpStatus.NO_CONTENT);

		const b = await request(httpServer)
			.get('/blogs/' + createdBlog1.id)
			.expect(HttpStatus.OK);

		expect(b.body).toEqual({
			id: expect.any(String),
			name: 'new name',
			description: 'new description',
			websiteUrl: 'https://vercel.com/',
			createdAt: expect.any(String),
			isMembership: false,
		});
	});

	//DELETE
	it('should delete blog', async () => {
		await request(httpServer)
			.delete('/sa/blogs/' + createdBlog1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(HttpStatus.NO_CONTENT);

		await request(httpServer)
			.get('/blogs/' + createdBlog1.id)
			.expect(HttpStatus.NOT_FOUND);

		await request(httpServer).get('/blogs').expect(HttpStatus.OK, {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		});
	});
});
