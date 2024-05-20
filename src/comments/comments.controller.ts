import { CommentsQueryRepository } from './comments.query.repository';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { JwtBearerGuard } from '../auth/passport/guards/jwt-bearer.guard';
import { StatusCode, commentIdField, commentNotFound } from '../exceptions/exception.constants';
import { UserFromReq } from '../auth/decorators/userId.decorator';
import { exceptionHandler } from '../exceptions/exception.handler';
import { likeInputDto } from '../likes/likes.types';
import { contentInputDto } from './comments.types';
import { UserAuthGuard } from '../auth/passport/guards/userId.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CheckCommentLikeStatusCommand } from '../likes/use-cases/comment likes/check-comment-like-status.use-case';
import { SetCommentLikeStatusCommand } from '../likes/use-cases/comment likes/set-comment-like-status.use-case';
import { UserFromGuard } from '../users/users.types';
import { UpdateCommentCommand } from './use-cases/update-comment.use-case';
import { DeleteCommentCommand } from './use-cases/delete-comment.use-case';

@Controller('comments')
export class CommentsController {
	constructor(
		private commandBus: CommandBus,
		private readonly commentsQueryRepository: CommentsQueryRepository
	) {}

	@UseGuards(UserAuthGuard)
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async getComment(@Param('id') commentId: string, @UserFromReq() user: UserFromGuard) {
		const comment = await this.commentsQueryRepository.findCommentById(commentId, user.id);
		if (comment) {
			return comment;
		}
		return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
	}

	@UseGuards(JwtBearerGuard)
	@Put(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateComment(
		@Param('id') commentId: string,
		@UserFromReq() user: UserFromGuard,
		@Body() inputModel: contentInputDto
	) {
		const result = await this.commandBus.execute(new UpdateCommentCommand(commentId, user.id, inputModel.content));
		if (result.code !== StatusCode.Success) {
			return exceptionHandler(result.code, result.message, result.field);
		}
		return result;
	}

	@UseGuards(JwtBearerGuard)
	@Put(':commentId/like-status')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateLikeStatus(
		@Param('commentId') commentId: string,
		@UserFromReq() user: UserFromGuard,
		@Body() inputModel: likeInputDto
	) {
		const comment = await this.commentsQueryRepository.findCommentById(commentId, user.id);

		if (!comment) {
			return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
		} else {
			const checkLikeStatus = await this.commandBus.execute(
				new CheckCommentLikeStatusCommand(inputModel.likeStatus, comment.id, user.id)
			);
			if (!checkLikeStatus) {
				const isCreated = await this.commandBus.execute(
					new SetCommentLikeStatusCommand(inputModel.likeStatus, comment.id, user.id, user.login)
				);
				if (!isCreated) {
					return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
				}
			} else return;
		}
	}

	@UseGuards(JwtBearerGuard)
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteComment(@Param('id') commentId: string, @UserFromReq() user: UserFromGuard) {
		const result = await this.commandBus.execute(new DeleteCommentCommand(commentId, user.id));
		if (result.code !== StatusCode.Success) {
			return exceptionHandler(result.code, result.message, result.field);
		}
		return result;
	}
}
