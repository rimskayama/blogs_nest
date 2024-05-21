import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { PostLikesRepository } from '../../post.likes.repository';

export class SetPostLikeStatusCommand {
	constructor(
		public likeStatus: string,
		public postId: string,
		public userId: string,
		public userLogin: string
	) {}
}

@CommandHandler(SetPostLikeStatusCommand)
export class SetPostLikeStatusUseCase implements ICommandHandler<SetPostLikeStatusCommand> {
	constructor(private readonly postLikesRepository: PostLikesRepository) {}
	async execute(command: SetPostLikeStatusCommand): Promise<boolean> {
		const like = {
			id: uuidv4(),
			postId: command.postId,
			status: command.likeStatus,
			userId: command.userId,
			addedAt: new Date(),
		};
		return await this.postLikesRepository.setLikeStatus(like);
	}
}
