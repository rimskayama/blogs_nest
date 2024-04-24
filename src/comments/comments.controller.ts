import { LikesService } from '../likes/likes.service';
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

@Controller('comments')
export class CommentsController {
	constructor(
		private readonly commentsService: CommentsService,
		private readonly likesService: LikesService,
		private readonly commentsQueryRepository: CommentsQueryRepository
	) {}

	@UseGuards(UserAuthGuard)
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async getComment(@Param('id') commentId: string, @UserFromReq() userId: string | false) {
		const comment = await this.commentsQueryRepository.findCommentById(commentId, userId);
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
		@UserFromReq() userId: string | false,
		@Body() contentInputModel: contentInputDto
	) {
		const comment = await this.commentsQueryRepository.findCommentById(commentId, userId);
		if (!comment) {
			return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
		}
		if (comment.commentatorInfo.userId !== userId) {
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
		@UserFromReq() userId: string,
		@Body() inputModel: likeInputDto
	) {
		const comment = await this.commentsQueryRepository.findCommentById(commentId, userId);

		if (!comment) {
			return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
		} else {
			const checkLikeStatus = await this.likesService.checkCommentLikeStatus(inputModel.likeStatus, comment.id, userId);
			if (checkLikeStatus) {
				const likesInfo = await this.likesService.countCommentLikes(comment.id);
				await this.commentsQueryRepository.updateCommentLikes(
					comment.id,
					likesInfo.likesCount,
					likesInfo.dislikesCount
				);
				return;
			} else {
				const isCreated = await this.likesService.setCommentLikeStatus(inputModel.likeStatus, comment, userId);
				if (isCreated) {
					const likesInfo = await this.likesService.countCommentLikes(comment.id);
					await this.commentsQueryRepository.updateCommentLikes(
						comment.id,
						likesInfo.likesCount,
						likesInfo.dislikesCount
					);
					return;
				}
				return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
			}
		}
	}

	@UseGuards(JwtBearerGuard)
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteComment(@Param('id') commentId: string, @UserFromReq() userId: string | false) {
		const comment = await this.commentsQueryRepository.findCommentById(commentId, userId);
		if (!comment) {
			return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
		}
		if (comment.commentatorInfo.userId !== userId) {
			return exceptionHandler(StatusCode.Forbidden, forbidden, commentIdField);
		}

		const isDeleted = await this.commentsService.deleteComment(commentId);
		if (isDeleted) {
			return;
		}
		return exceptionHandler(StatusCode.NotFound, commentNotFound, commentIdField);
	}
}
