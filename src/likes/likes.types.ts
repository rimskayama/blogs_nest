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
