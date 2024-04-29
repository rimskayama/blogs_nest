import { CommentsRepository } from './comments.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
	constructor(private readonly commentsRepository: CommentsRepository) {}

	async updateComment(id: string, content: string) {
		return await this.commentsRepository.updateComment(id, content);
	}

	async deleteComment(id: string) {
		return await this.commentsRepository.deleteComment(id);
	}
}
