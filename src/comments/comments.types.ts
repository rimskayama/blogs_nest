import { Length } from 'class-validator';
import { Transform } from 'class-transformer';
import validator from 'validator';
import { LikeStatus } from '../likes/likes.types';

export class CommentViewDto {
	id: string;
	content: string;
	commentatorInfo: {
		userId: string;
		userLogin: string;
	};
	createdAt: string;
	likesInfo: {
		likesCount: number;
		dislikesCount: number;
		myStatus: string;
	};
}

export class commentDto {
	id: string;
	postId: string;
	content: string;
	commentatorId: string;
	commentatorLogin: string;
	createdAt: Date;
	likesCount: number;
	dislikesCount: number;
}

export class contentInputDto {
	@Transform(({ value }) => validator.trim(value))
	@Length(20, 300)
	content: string;
}

export class CommentType {
	id: string;
	postId: string;
	content: string;
	createdAt: Date;
	commentatorId: string;
	commentatorLogin: string;
	likesCount: number;
	dislikesCount: number;
	myStatus: string;

	static getViewComment(commentFromDb: CommentType): CommentViewDto {
		return {
			id: commentFromDb.id,
			content: commentFromDb.content,
			commentatorInfo: {
				userId: commentFromDb.commentatorId,
				userLogin: commentFromDb.commentatorLogin,
			},
			createdAt: commentFromDb.createdAt.toISOString(),
			likesInfo: {
				likesCount: commentFromDb.likesCount,
				dislikesCount: commentFromDb.dislikesCount,
				myStatus: commentFromDb.myStatus || LikeStatus.None,
			},
		};
	}
}
