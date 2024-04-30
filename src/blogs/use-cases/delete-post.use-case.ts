import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../blogs.repository';
import { StatusCode, blogIdField, blogNotFound, postIdField, postNotFound } from '../../exceptions/exception.constants';
import { exceptionResultType } from '../../exceptions/exception.types';
import { BlogsQueryRepository } from '../blogs.query.repository';

export class DeletePostCommand {
	constructor(
		public blogId: string,
		public postId: string
	) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
	constructor(
		private readonly blogsQueryRepository: BlogsQueryRepository,
		public readonly blogsRepository: BlogsRepository
	) {}
	async execute(command: DeletePostCommand): Promise<exceptionResultType | boolean> {
		const blog = await this.blogsQueryRepository.findBlogById(command.blogId);
		if (!blog)
			return {
				code: StatusCode.NotFound,
				message: blogNotFound,
				field: blogIdField,
			};
		const result = await this.blogsRepository.deletePost(command.postId);
		if (!result) {
			return {
				code: StatusCode.NotFound,
				message: postNotFound,
				field: postIdField,
			};
		}
		return {
			code: StatusCode.Success,
		};
	}
}
