import { IsEnum } from 'class-validator';
import { User } from '../users/domain/user.entity';

export enum LikeStatus {
	None = 'None',
	Like = 'Like',
	Dislike = 'Dislike',
}

export class likeDetails {
	addedAt: string;

	userId: string;

	user: User;
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
	addedAt: Date;
}

export class CommentLikeType {
	id: string;
	commentId: string;
	status: string;
	userId: string;
	addedAt: Date;
}
