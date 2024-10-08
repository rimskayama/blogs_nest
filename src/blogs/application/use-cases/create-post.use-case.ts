import { v4 as uuidv4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../repositories/blogs.repository';
import { PostViewDto } from '../../../posts/posts.types';
import { PostInputDto } from '../../../posts/posts.dto';

export class CreatePostCommand {
	constructor(
		public inputModel: PostInputDto,
		public blogId: string,
		public blogName: string
	) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
	constructor(private readonly blogsRepository: BlogsRepository) {}
	async execute(command: CreatePostCommand): Promise<PostViewDto | boolean> {
		const newPost = {
			id: uuidv4(),
			title: command.inputModel.title,
			shortDescription: command.inputModel.shortDescription,
			content: command.inputModel.content,
			blogId: command.blogId,
			createdAt: new Date(),
		};
		return this.blogsRepository.createPostForSpecifiedBlog(newPost);
	}
}
