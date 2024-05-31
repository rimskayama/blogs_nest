import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StatusCode, commentIdField, commentNotFound, forbidden } from '../../../exceptions/exception.constants';
import { exceptionResultType } from '../../../exceptions/exception.types';
import { CommentsQueryRepository } from '../../repositories/comments.query.repository';
import { CommentsRepository } from '../../repositories/comments.repository';

export class UpdateCommentCommand {
	constructor(
		public commentId: string,
		public userId: string,
		public content: string
	) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
	constructor(
		private readonly commentsQueryRepository: CommentsQueryRepository,
		private readonly commentsRepository: CommentsRepository
	) {}
	async execute(command: UpdateCommentCommand): Promise<exceptionResultType | boolean> {
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

		const result = await this.commentsRepository.updateComment(command.commentId, command.content);
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
