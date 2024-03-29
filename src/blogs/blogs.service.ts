import { BlogInputDto, BlogDto } from './blogs.types';
import { ObjectId } from 'mongodb';
import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsService {
	constructor(private blogsRepository: BlogsRepository) {}

	async createBlog(inputModel: BlogInputDto): Promise<BlogDto> {
		const newBlog = {
			_id: new ObjectId(),
			name: inputModel.name,
			description: inputModel.description,
			websiteUrl: inputModel.websiteUrl,
			createdAt: new Date().toISOString(),
			isMembership: false,
		};

		return await this.blogsRepository.createBlog(newBlog);
	}

	async updateBlog(id: string, inputModel: BlogInputDto): Promise<BlogDto | boolean> {
		return await this.blogsRepository.updateBlog(new ObjectId(id), inputModel);
	}

	async deleteBlog(id: string) {
		return await this.blogsRepository.deleteBlog(new ObjectId(id));
	}

	async deleteAll() {
		return await this.blogsRepository.deleteAll();
	}
}
