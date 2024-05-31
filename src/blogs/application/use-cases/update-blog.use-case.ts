import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputDto } from 'src/blogs/blogs.dto';
import { BlogsRepository } from '../../repositories/blogs.repository';
import { StatusCode, blogIdField, blogNotFound } from '../../../exceptions/exception.constants';
import { exceptionResultType } from '../../../exceptions/exception.types';

export class UpdateBlogCommand {
	constructor(
		public id: string,
		public inputModel: BlogInputDto
	) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
	constructor(private readonly blogsRepository: BlogsRepository) {}
	async execute(command: UpdateBlogCommand): Promise<exceptionResultType | boolean> {
		const result = await this.blogsRepository.updateBlog(command.id, command.inputModel);
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
