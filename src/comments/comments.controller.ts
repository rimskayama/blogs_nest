import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './comments.query.repository';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { JwtBearerGuard } from '../auth/passport/guards/jwt-bearer.guard';
import { StatusCode, commentIdField, commentNotFound, forbidden } from '../exceptions/exception.constants';
import { UserFromReq } from '../auth/decorators/userId.decorator';
import { exceptionHandler } from '../exceptions/exception.handler';
import { likeInputDto } from '../likes/likes.types';
import { contentInputDto } from './comments.types';
import { UserAuthGuard } from '../auth/passport/guards/userId.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CheckCommentLikeStatusCommand } from '../likes/use-cases/comment likes/check-comment-like-status.use-case';
import { SetCommentLikeStatusCommand } from '../likes/use-cases/comment likes/set-comment-like-status.use-case';
import { UserFromGuard } from '../users/users.types';
import { UpdateCommentLikesCommand } from '../likes/use-cases/comment likes/update-comment-likes.use-case';

@Controller('comments')
export class CommentsController {
	constructor(
		private commandBus: CommandBus,
		private readonly commentsService: CommentsService,
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
		@Body() contentInputModel: contentInputDto
	) {
		const comment = await this.commentsQueryRepository.findCommentById(commentId, user.id);
		if (!comment) {
			return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
		}
		if (comment.commentatorInfo.userId !== user.id) {
			return exceptionHandler(StatusCode.Forbidden, forbidden, commentIdField);
		}
		await this.commentsService.updateComment(commentId, contentInputModel.content);
		return;
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
			if (checkLikeStatus) {
				await this.commandBus.execute(new UpdateCommentLikesCommand(comment.id));
				return;
			} else {
				const isCreated = await this.commandBus.execute(
					new SetCommentLikeStatusCommand(inputModel.likeStatus, comment.id, user.id, user.login)
				);
				if (isCreated) {
					await this.commandBus.execute(new UpdateCommentLikesCommand(comment.id));
					return;
				}
				return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
			}
		}
	}

	@UseGuards(JwtBearerGuard)
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteComment(@Param('id') commentId: string, @UserFromReq() user: UserFromGuard) {
		const comment = await this.commentsQueryRepository.findCommentById(commentId, user.id);
		if (!comment) {
			return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
		}
		if (comment.commentatorInfo.userId !== user.id) {
			return exceptionHandler(StatusCode.Forbidden, forbidden, commentIdField);
		}

		const isDeleted = await this.commentsService.deleteComment(commentId);
		if (isDeleted) {
			return;
		}
		return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
	}
}
