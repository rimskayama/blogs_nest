import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StatusCode, commentIdField, commentNotFound, forbidden } from '../../exceptions/exception.constants';
import { exceptionResultType } from '../../exceptions/exception.types';
import { CommentsQueryRepository } from '../comments.query.repository';
import { CommentsRepository } from '../comments.repository';

export class DeleteCommentCommand {
	constructor(
		public commentId: string,
		public userId: string
	) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
	constructor(
		private readonly commentsQueryRepository: CommentsQueryRepository,
		private readonly commentsRepository: CommentsRepository
	) {}
	async execute(command: DeleteCommentCommand): Promise<exceptionResultType | boolean> {
		const comment = await this.commentsQueryRepository.findCommentById(command.commentId, command.userId);
		if (!comment) {
			return {
				code: StatusCode.NotFound,
				message: commentNotFound,
				field: commentIdField,
			};
		}
		if (comment.commentatorInfo.userId !== command.userId) {
			return {
				code: StatusCode.Forbidden,
				message: forbidden,
				field: commentIdField,
			};
		}

		const result = await this.commentsRepository.deleteComment(command.commentId);
		if (!result) {
			return {
				code: StatusCode.NotFound,
				message: commentNotFound,
				field: commentIdField,
			};
		}
		return {
			code: StatusCode.Success,
		};
	}
}
