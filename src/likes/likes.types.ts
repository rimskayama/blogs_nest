import { User } from '../users/domain/user.entity';

export enum LikeStatus {
	None = 'None',
	Like = 'Like',
	Dislike = 'Dislike',
}

export type likeDetails = {
	addedAt: string;
	userId: string;
	user: User;
};

export type likeDetailsDto = {
	addedAt: string;
	userId: string;
	login: string;
};

export type PostLikeType = {
	id: string;
	postId: string;
	status: string;
	userId: string;
	addedAt: Date;
};

export type CommentLikeType = {
	id: string;
	commentId: string;
	status: string;
	userId: string;
	addedAt: Date;
};
