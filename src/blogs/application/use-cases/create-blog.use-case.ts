import { v4 as uuidv4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogDto } from '../../blogs.types';
import { BlogInputDto } from 'src/blogs/blogs.dto';
import { BlogsRepository } from '../../repositories/blogs.repository';

export class CreateBlogCommand {
	constructor(public inputModel: BlogInputDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
	constructor(private readonly blogsRepository: BlogsRepository) {}
	async execute(command: CreateBlogCommand): Promise<BlogDto | boolean> {
		const newBlog = {
			id: uuidv4(),
			name: command.inputModel.name,
			description: command.inputModel.description,
			websiteUrl: command.inputModel.websiteUrl,
			createdAt: new Date(),
			isMembership: false,
		};
		return this.blogsRepository.createBlog(newBlog);
	}
}
