import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../blogs.repository';
import { StatusCode, blogIdField, blogNotFound } from '../../exceptions/exception.constants';
import { exceptionResultType } from '../../exceptions/exception.types';

export class DeleteBlogCommand {
	constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
	constructor(private readonly blogsRepository: BlogsRepository) {}
	async execute(command: DeleteBlogCommand): Promise<exceptionResultType | boolean> {
		const result = await this.blogsRepository.deleteBlog(command.id);
		if (!result) {
			return {
				code: StatusCode.NotFound,
				field: blogIdField,
				message: blogNotFound,
			};
		}
		return {
			code: StatusCode.Success,
		};
	}
}
