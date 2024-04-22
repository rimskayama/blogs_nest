import { v4 as uuidv4 } from 'uuid';
import { BlogInputDto, BlogDto } from './blogs.types';
import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';
import { PostViewDto, PostInputDto, PostDto } from 'src/posts/posts.types';

@Injectable()
export class BlogsService {
	constructor(private blogsRepository: BlogsRepository) {}

	async createBlog(inputModel: BlogInputDto): Promise<BlogDto> {
		const newBlog = {
			id: uuidv4(),
			name: inputModel.name,
			description: inputModel.description,
			websiteUrl: inputModel.websiteUrl,
			createdAt: new Date(),
			isMembership: false,
		};

		return await this.blogsRepository.createBlog(newBlog);
	}

	async updateBlog(id: string, inputModel: BlogInputDto): Promise<BlogDto | boolean> {
		return await this.blogsRepository.updateBlog(id, inputModel);
	}

	async deleteBlog(id: string): Promise<boolean> {
		return await this.blogsRepository.deleteBlog(id);
	}
	async createPostForSpecifiedBlog(
		inputModel: PostInputDto,
		blogId: string,
		blogName: string
	): Promise<PostViewDto | boolean> {
		const newPost = {
			id: uuidv4(),
			title: inputModel.title,
			shortDescription: inputModel.shortDescription,
			content: inputModel.content,
			blogId: blogId,
			blogName: blogName,
			createdAt: new Date(),
			likesCount: 0,
			dislikesCount: 0,
		};
		return await this.blogsRepository.createPostForSpecifiedBlog(newPost);
	}
	async updatePost(blogId: string, postId: string, inputModel: PostInputDto): Promise<PostDto | boolean> {
		return await this.blogsRepository.updatePost(blogId, postId, inputModel);
	}

	async deletePost(id: string): Promise<true | null> {
		return await this.blogsRepository.deletePost(id);
	}
}
