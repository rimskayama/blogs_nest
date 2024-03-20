import { Type } from 'class-transformer';
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

export class likeStatus {
	@IsEnum(LikeStatus)
	likeStatus: LikeStatus;
}

export class likeInputDto {
	@Type(() => likeStatus)
	likeStatus: likeStatus;
}
