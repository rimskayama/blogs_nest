import { Inject, Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { PostsQueryRepository } from './posts.query.repository';
import { ObjectId } from 'mongodb';
import { PostDto, PostInputDto } from './posts.types';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';

@Injectable()
export class PostsService {
	constructor(
		@Inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
		@Inject(PostsRepository) protected postsRepository: PostsRepository,
		@Inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository
	) {}

	async createPost(inputModel: PostInputDto): Promise<PostDto | boolean> {
		const blog = await this.blogsQueryRepository.findBlogById(inputModel.blogId);

		if (blog) {
			const newPost = {
				_id: new ObjectId(),
				title: inputModel.title,
				shortDescription: inputModel.shortDescription,
				content: inputModel.content,
				blogId: inputModel.blogId,
				blogName: blog.name,
				createdAt: new Date().toISOString(),
				extendedLikesInfo: {
					likesCount: 0,
					dislikesCount: 0,
					myStatus: 'None',
					newestLikes: [],
				},
			};
			return await this.postsRepository.createPost(newPost);
		} else return false;
	}

	async updatePost(id: string, inputModel: PostInputDto): Promise<PostDto | boolean> {
		//let foundBlog = await this.blogsQueryRepository.findBlogByBlogId(blogId);

		//if (foundBlog) {
		return await this.postsRepository.updatePost(new ObjectId(id), inputModel);
	}

	async deletePost(id: string) {
		return await this.postsRepository.deletePost(new ObjectId(id));
	}

	async deleteAll() {
		return await this.postsRepository.deleteAll();
	}
}
