import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { CommentLikesRepository } from '../../comment.likes.repository';

export class SetCommentLikeStatusCommand {
	constructor(
		public likeStatus: string,
		public commentId: string,
		public userId: string,
		public userLogin: string
	) {}
}

@CommandHandler(SetCommentLikeStatusCommand)
export class SetCommentLikeStatusUseCase implements ICommandHandler<SetCommentLikeStatusCommand> {
	constructor(private readonly commentLikesRepository: CommentLikesRepository) {}
	async execute(command: SetCommentLikeStatusCommand): Promise<boolean> {
		const like = {
			id: uuidv4(),
			commentId: command.commentId,
			status: command.likeStatus,
			userId: command.userId,
			addedAt: new Date(),
		};
		return await this.commentLikesRepository.setLikeStatus(like);
	}
}
