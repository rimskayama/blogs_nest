import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentLikesRepository } from '../../comment.likes.repository';

export class UpdateCommentLikesCommand {
	constructor(public commentId: string) {}
}

@CommandHandler(UpdateCommentLikesCommand)
export class UpdateCommentLikesUseCase implements ICommandHandler<UpdateCommentLikesCommand> {
	constructor(private readonly commentLikesRepository: CommentLikesRepository) {}
	async execute(command: UpdateCommentLikesCommand): Promise<boolean> {
		const likesInfo = await this.commentLikesRepository.countLikes(command.commentId);
		return await this.commentLikesRepository.updateCommentLikes(
			command.commentId,
			likesInfo.likesCount,
			likesInfo.dislikesCount
		);
	}
}
