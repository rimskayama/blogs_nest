import { v4 as uuidv4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentViewDto, contentInputDto } from '../comments.types';
import { CommentsRepository } from '../comments.repository';

export class CreateCommentCommand {
	constructor(
		public inputModel: contentInputDto,
		public postId: string,
		public userId: string,
		public userLogin: string
	) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
	constructor(private readonly commentsRepository: CommentsRepository) {}
	async execute(command: CreateCommentCommand): Promise<CommentViewDto | boolean> {
		const newComment = {
			id: uuidv4(),
			postId: command.postId,
			content: command.inputModel.content,
			createdAt: new Date(),
			userId: command.userId,
		};
		return await this.commentsRepository.createComment(newComment);
	}
}
