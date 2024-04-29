import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostLikesRepository } from '../../post.likes.repository';

export class CheckPostLikeStatusCommand {
	constructor(
		public likeStatus: string,
		public postId: string,
		public userId: string
	) {}
}

@CommandHandler(CheckPostLikeStatusCommand)
export class CheckPostLikeStatusUseCase implements ICommandHandler<CheckPostLikeStatusCommand> {
	constructor(private readonly postLikesRepository: PostLikesRepository) {}
	async execute(command: CheckPostLikeStatusCommand): Promise<boolean> {
		if (command.likeStatus === 'None') {
			await this.postLikesRepository.removeLike(command.postId, command.userId);
			return true;
		} else {
			//Like or Dislike
			const likeInDB = await this.postLikesRepository.checkLikeInDB(command.postId, command.userId);
			if (!likeInDB) return false; // can be created
			if (likeInDB) {
				if (likeInDB.status === command.likeStatus) return true;
				if (likeInDB.status !== command.likeStatus) {
					await this.postLikesRepository.updateLikeStatus(command.likeStatus, command.postId, command.userId);
					return true;
				}
			}
		}
	}
}
