import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostLikesRepository } from '../../post.likes.repository';

export class UpdatePostLikesCommand {
	constructor(public postId: string) {}
}

@CommandHandler(UpdatePostLikesCommand)
export class UpdatePostLikesUseCase implements ICommandHandler<UpdatePostLikesCommand> {
	constructor(private readonly postLikesRepository: PostLikesRepository) {}
	async execute(command: UpdatePostLikesCommand): Promise<boolean> {
		const likesInfo = await this.postLikesRepository.countLikes(command.postId);
		return await this.postLikesRepository.updatePostLikes(
			command.postId,
			likesInfo.likesCount,
			likesInfo.dislikesCount
		);
	}
}
