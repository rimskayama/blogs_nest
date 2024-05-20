import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentLikesRepository } from '../../comment.likes.repository';
import { LikeStatus } from '../../likes.types';

export class CheckCommentLikeStatusCommand {
	constructor(
		public likeStatus: string,
		public commentId: string,
		public userId: string
	) {}
}

@CommandHandler(CheckCommentLikeStatusCommand)
export class CheckCommentLikeStatusUseCase implements ICommandHandler<CheckCommentLikeStatusCommand> {
	constructor(private readonly commentLikesRepository: CommentLikesRepository) {}
	async execute(command: CheckCommentLikeStatusCommand): Promise<boolean> {
		if (command.likeStatus === LikeStatus.None) {
			await this.commentLikesRepository.removeLike(command.commentId, command.userId);
			return true;
		} else {
			//Like or Dislike
			const likeInDB = await this.commentLikesRepository.checkLikeInDB(command.commentId, command.userId);
			if (!likeInDB) return false; // can be created
			if (likeInDB) {
				if (likeInDB.status === command.likeStatus) return true;
				if (likeInDB.status !== command.likeStatus) {
					await this.commentLikesRepository.updateLikeStatus(command.likeStatus, command.commentId, command.userId);
					return true;
				}
			}
		}
	}
}
