import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../repositories/blogs.repository';
import {
	StatusCode,
	blogIdField,
	blogNotFound,
	postIdField,
	postNotFound,
} from '../../../exceptions/exception.constants';
import { exceptionResultType } from '../../../exceptions/exception.types';
import { BlogsQueryRepository } from '../../repositories/blogs.query.repository';
import { PostInputDto } from '../../../posts/posts.types';

export class UpdatePostCommand {
	constructor(
		public blogId: string,
		public postId: string,
		public inputModel: PostInputDto
	) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
	constructor(
		private readonly blogsQueryRepository: BlogsQueryRepository,
		public readonly blogsRepository: BlogsRepository
	) {}
	async execute(command: UpdatePostCommand): Promise<exceptionResultType | boolean> {
		const blog = await this.blogsQueryRepository.findBlogById(command.blogId);
		if (!blog)
			return {
				code: StatusCode.NotFound,
				message: blogNotFound,
				field: blogIdField,
			};

		const result = await this.blogsRepository.updatePost(command.postId, command.inputModel);
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
