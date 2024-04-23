import { IsEnum } from 'class-validator';

export enum LikeStatus {
	None = 'None',
	Like = 'Like',
	Dislike = 'Dislike',
}

export type likeDetailsDto = {
	addedAt: string;
	userId: string;
	login: string;
};

export class likeInputDto {
	@IsEnum(LikeStatus)
	likeStatus: LikeStatus;
}

export class PostLikeType {
	id: string;
	postId: string;
	status: string;
	userId: string;
	login: string;
	addedAt: Date;

	static getViewLikeDetails(likeDetails: PostLikeType): likeDetailsDto {
		return {
			addedAt: likeDetails.addedAt.toISOString(),
			userId: likeDetails.userId,
			login: likeDetails.login,
		};
	}
}

export class CommentLikeType {
	id: string;
	commentId: string;
	status: string;
	userId: string;
	login: string;
	addedAt: Date;

	static getViewLikeDetails(likeDetails: PostLikeType): likeDetailsDto {
		return {
			addedAt: likeDetails.addedAt.toISOString(),
			userId: likeDetails.userId,
			login: likeDetails.login,
		};
	}
}
