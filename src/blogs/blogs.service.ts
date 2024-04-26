import { BlogInputDto, BlogDto } from './blogs.types';
import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';
import { PostInputDto, PostDto } from 'src/posts/posts.types';

@Injectable()
export class BlogsService {
	constructor(private blogsRepository: BlogsRepository) {}

	async updateBlog(id: string, inputModel: BlogInputDto): Promise<BlogDto | boolean> {
		return await this.blogsRepository.updateBlog(id, inputModel);
	}

	async deleteBlog(id: string): Promise<boolean> {
		return await this.blogsRepository.deleteBlog(id);
	}
	async updatePost(blogId: string, postId: string, inputModel: PostInputDto): Promise<PostDto | boolean> {
		return await this.blogsRepository.updatePost(blogId, postId, inputModel);
	}

	async deletePost(id: string): Promise<true | null> {
		return await this.blogsRepository.deletePost(id);
	}
}
