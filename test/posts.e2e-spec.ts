import { Test, type TestingModule } from '@nestjs/testing';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/app.settings';

describe('PostsController (e2e)', () => {
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
	it('should return 200 and posts', async () => {
		await request(httpServer).get('/posts').expect(HttpStatus.OK, {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		});
	});

	it('should return 404 for not existing post', async () => {
		await request(httpServer)
			.get('/posts/6413437e44902b9011d0b316')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(404);
	});

	//POST

	let createdBlog1: any = { id: 0 };

	it('should create blog for posts testing', async () => {
		const data = {
			name: 'string',
			description: 'string',
			websiteUrl: 'https://www.base64encode.org/',
		};
		const createResponse = await request(httpServer)
			.post('/blogs')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(201);

		createdBlog1 = createResponse.body;
		//console.log(createdBlog1);

		await request(httpServer).get('/blogs').expect(200);
	});

	//GET blogs/:blogId/posts

	it('should return posts for specific blog', async () => {
		await request(httpServer)
			.get('/blogs/' + createdBlog1.id + '/posts')
			.expect(200, {
				pagesCount: 0,
				page: 1,
				pageSize: 10,
				totalCount: 0,
				items: [],
			});
	});

	let createdPost1: any = { id: 0 };

	// POST blogs/:blogId/posts

	it('should create post for specific blog', async () => {
		//console.log(createdBlog1);
		const data = {
			title: 'post title',
			content: 'post content',
			shortDescription: 'short Description',
		};
		const createResponse = await request(httpServer)
			.post('/blogs/' + createdBlog1.id + '/posts')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(201);

		createdPost1 = createResponse.body;

		const b = await request(httpServer)
			.get('/blogs/' + createdBlog1.id + '/posts')
			.expect(200);

		//console.log(b.body, 'list of posts for specific blog')

		expect(b.body).toEqual({
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			totalCount: 1,
			items: [
				{
					id: expect.any(String),
					title: 'post title',
					shortDescription: 'short Description',
					content: 'post content',
					blogId: createdBlog1.id,
					blogName: createdPost1.blogName,
					createdAt: expect.any(String),
					extendedLikesInfo: {
						dislikesCount: 0,
						likesCount: 0,
						myStatus: 'None',
						newestLikes: [],
					},
				},
			],
		});
	});

	//DELETE

	it('should delete post', async () => {
		await request(httpServer)
			.delete('/posts/' + createdPost1.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.expect(204);

		await request(httpServer)
			.get('/posts/' + createdPost1.id)
			.expect(404);

		await request(httpServer).get('/posts').expect(200, {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		});
	});

	// POST posts/

	let createdPost2: any = { id: 0 };

	it('should NOT create post without ID', async () => {
		const data = {
			title: 'post title',
			content: 'post content',
			shortDescription: 'short Description',
		};
		await request(httpServer).post('/posts').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(data).expect(400);

		await request(httpServer).get('/posts').expect(200, {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		});
	});

	it('should create post with correct input data', async () => {
		const data = {
			title: 'post title',
			content: 'post content',
			blogId: createdBlog1.id,
			shortDescription: 'short Description',
		};
		const createResponse = await request(httpServer)
			.post('/posts')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(201);

		createdPost2 = createResponse.body;
		//console.log(createdPost1);

		const b = await request(httpServer).get('/posts').expect(200);

		//console.log(b.body, 'list of posts')

		expect(b.body).toEqual({
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			totalCount: 1,
			items: [
				{
					id: expect.any(String),
					title: 'post title',
					shortDescription: 'short Description',
					content: 'post content',
					blogId: createdPost2.blogId,
					blogName: createdPost2.blogName,
					createdAt: expect.any(String),
					extendedLikesInfo: {
						dislikesCount: 0,
						likesCount: 0,
						myStatus: 'None',
						newestLikes: [],
					},
				},
			],
		});
	});

	//PUT posts/

	it('should NOT update post that not exist', async () => {
		const data = {
			title: 'new post title',
			content: 'new post content',
			blogId: createdBlog1.id,
			shortDescription: 'new short Description',
		};
		await request(httpServer)
			.put('/posts/' + '642681e8ad245fa9580960f8')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(404);
	});

	it('should NOT update post with incorrect title', async () => {
		const data = {
			id: createdPost2.id,
			title: 'title that is more than 30 characters',
			content: 'post content',
			blogId: createdBlog1.id,
			shortDescription: 'short Description',
		};

		await request(httpServer)
			.put('/posts/' + createdPost2.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(400, {
				errorsMessages: [
					{
						message: 'title must be shorter than or equal to 30 characters',
						field: 'title',
					},
				],
			});
	});

	it('should update post with correct input data', async () => {
		//console.log(createdPost2)
		const data = {
			title: 'new post title',
			content: 'new post content',
			blogId: createdBlog1.id,
			shortDescription: 'new short Description',
		};

		await request(httpServer)
			.put('/posts/' + createdPost2.id)
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(204);

		const b = await request(httpServer)
			.get('/posts/' + createdPost2.id)
			.expect(200);

		createdPost2 = b.body;

		expect(b.body).toEqual({
			id: expect.any(String),
			title: 'new post title',
			shortDescription: 'new short Description',
			content: 'new post content',
			blogId: createdPost2.blogId,
			blogName: createdPost2.blogName,
			createdAt: expect.any(String),
			extendedLikesInfo: {
				dislikesCount: 0,
				likesCount: 0,
				myStatus: 'None',
				newestLikes: [],
			},
		});
	});

	//LIKES

	//POST auth/registration USER 1
	let createdUser1: any = { id: 0 };
	it('should create user 1 for post likes testing', async () => {
		const data = {
			password: 'qwerty1',
			email: 'rimskayama@outlook.com',
			login: 'login1',
		};

		const createResponse = await request(httpServer)
			.post('/users')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(201);

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
					login: createdUser1.login,
					email: createdUser1.email,
					createdAt: expect.any(String),
				},
			],
		});
	});

	//POST auth/registration USER 2
	let createdUser2: any = { id: 1 };
	it('should create user 2 for post likes testing', async () => {
		const data = {
			password: 'qwerty2',
			email: 'emailofuser@outlook.com',
			login: 'login2',
		};

		const createResponse = await request(httpServer)
			.post('/users')
			.set('Authorization', 'Basic YWRtaW46cXdlcnR5')
			.send(data)
			.expect(201);

		createdUser2 = createResponse.body;

		const b = await request(httpServer).get('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(200);

		expect(b.body).toEqual({
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			totalCount: 2,
			items: [
				{
					id: expect.any(String),
					login: createdUser2.login,
					email: createdUser2.email,
					createdAt: expect.any(String),
				},
				{
					id: expect.any(String),
					login: createdUser1.login,
					email: createdUser1.email,
					createdAt: expect.any(String),
				},
			],
		});
	});

	// POST auth/login -> get accessToken USER 1

	let accessToken = '';
	it('should login user 1 to like posts', async () => {
		const data = {
			password: 'qwerty1',
			loginOrEmail: 'login1',
		};

		const createResponse = await request(httpServer).post('/auth/login').send(data).expect(200);

		accessToken = createResponse.body.accessToken;
	});

	it('should return status None without authorization', async () => {
		const b = await request(httpServer)
			.get('/posts/' + createdPost2.id)
			.expect(200);

		expect(b.body).toEqual({
			id: expect.any(String),
			title: 'new post title',
			shortDescription: 'new short Description',
			content: 'new post content',
			blogId: createdPost2.blogId,
			blogName: createdPost2.blogName,
			createdAt: expect.any(String),
			extendedLikesInfo: {
				dislikesCount: 0,
				likesCount: 0,
				myStatus: 'None',
				newestLikes: [],
			},
		});
	});

	// POST auth/login -> get accessToken USER 2

	let accessToken2 = '';
	it('should login user 2 to like posts', async () => {
		const data = {
			password: 'qwerty2',
			loginOrEmail: 'login2',
		};

		const createResponse = await request(httpServer).post('/auth/login').send(data).expect(200);

		accessToken2 = createResponse.body.accessToken;
	});

	//LIKES

	it('should set like status, dislike of user 1', async () => {
		const data = {
			likeStatus: 'Dislike',
		};
		await request(httpServer)
			.put('/posts/' + createdPost2.id + '/like-status')
			.set('Authorization', `Bearer ${accessToken}`)
			.send(data)
			.expect(204);

		const b = await request(httpServer)
			.get('/posts/' + createdPost2.id)
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200);

		expect(b.body).toEqual({
			id: expect.any(String),
			title: 'new post title',
			shortDescription: 'new short Description',
			content: 'new post content',
			blogId: createdPost2.blogId,
			blogName: createdPost2.blogName,
			createdAt: expect.any(String),
			extendedLikesInfo: {
				dislikesCount: 1,
				likesCount: 0,
				myStatus: 'Dislike',
				newestLikes: [],
			},
		});
	});

	it('should set like status, like of user 1', async () => {
		const data = {
			likeStatus: 'Like',
		};
		await request(httpServer)
			.put('/posts/' + createdPost2.id + '/like-status')
			.set('Authorization', `Bearer ${accessToken}`)
			.send(data)
			.expect(204);

		const b = await request(httpServer)
			.get('/posts/' + createdPost2.id)
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200);

		expect(b.body).toEqual({
			id: expect.any(String),
			title: 'new post title',
			shortDescription: 'new short Description',
			content: 'new post content',
			blogId: createdPost2.blogId,
			blogName: createdPost2.blogName,
			createdAt: expect.any(String),
			extendedLikesInfo: {
				dislikesCount: 0,
				likesCount: 1,
				myStatus: 'Like',
				newestLikes: [
					{
						addedAt: expect.any(String),
						userId: createdUser1.id,
						login: createdUser1.login,
					},
				],
			},
		});
	});

	it('should set like status, like of user 2', async () => {
		const data = {
			likeStatus: 'Like',
		};
		await request(httpServer)
			.put('/posts/' + createdPost2.id + '/like-status')
			.set('Authorization', `Bearer ${accessToken2}`)
			.send(data)
			.expect(204);

		const b = await request(httpServer)
			.get('/posts/' + createdPost2.id)
			.set('Authorization', `Bearer ${accessToken2}`)
			.expect(200);

		expect(b.body).toEqual({
			id: expect.any(String),
			title: 'new post title',
			shortDescription: 'new short Description',
			content: 'new post content',
			blogId: createdPost2.blogId,
			blogName: createdPost2.blogName,
			createdAt: expect.any(String),
			extendedLikesInfo: {
				dislikesCount: 0,
				likesCount: 2,
				myStatus: 'Like',
				newestLikes: [
					{
						addedAt: expect.any(String),
						userId: createdUser2.id,
						login: createdUser2.login,
					},
					{
						addedAt: expect.any(String),
						userId: createdUser1.id,
						login: createdUser1.login,
					},
				],
			},
		});
	});

	//GET POSTS WITH LIKES

	it('should return 200 and posts', async () => {
		const createResponse = await request(httpServer)
			.get('/posts')
			.set('Authorization', `Bearer ${accessToken2}`)
			.expect(200);

		const allPosts = createResponse.body;
		expect(allPosts).toEqual({
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			totalCount: 1,
			items: [
				{
					id: createdPost2.id,
					title: createdPost2.title,
					shortDescription: createdPost2.shortDescription,
					content: createdPost2.content,
					blogId: createdPost2.blogId,
					blogName: createdPost2.blogName,
					createdAt: createdPost2.createdAt,
					extendedLikesInfo: {
						dislikesCount: 0,
						likesCount: 2,
						myStatus: 'Like',
						newestLikes: [
							{
								addedAt: expect.any(String),
								userId: createdUser2.id,
								login: createdUser2.login,
							},
							{
								addedAt: expect.any(String),
								userId: createdUser1.id,
								login: createdUser1.login,
							},
						],
					},
				},
			],
		});

		// const newestLikes = createResponse.body.items[0].extendedLikesInfo
		//     expect(newestLikes).toEqual( {
		//         dislikesCount: 0,
		//         likesCount: 2,
		//         myStatus: "Like",
		//         newestLikes: [
		//             {
		//             addedAt: expect.any(String),
		//             userId: createdUser2.id,
		//             login: createdUser2.login
		//         },
		//         {
		//             addedAt: expect.any(String),
		//             userId: createdUser1.id,
		//             login: createdUser1.login
		//         }]
		//     })
	});

	it('should set like status, None', async () => {
		const data = {
			likeStatus: 'None',
		};
		await request(httpServer)
			.put('/posts/' + createdPost2.id + '/like-status')
			.set('Authorization', `Bearer ${accessToken}`)
			.send(data)
			.expect(204);

		const b = await request(httpServer)
			.get('/posts/' + createdPost2.id)
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200);

		expect(b.body).toEqual({
			id: expect.any(String),
			title: 'new post title',
			shortDescription: 'new short Description',
			content: 'new post content',
			blogId: createdPost2.blogId,
			blogName: createdPost2.blogName,
			createdAt: expect.any(String),
			extendedLikesInfo: {
				dislikesCount: 0,
				likesCount: 1,
				myStatus: 'None',
				newestLikes: [
					{
						addedAt: expect.any(String),
						userId: createdUser2.id,
						login: createdUser2.login,
					},
				],
			},
		});
	});
});
