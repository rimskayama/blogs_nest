import { IsEnum, IsString } from 'class-validator';

export enum LikeStatus {
	'None',
	'Like',
	'Dislike',
}

export type likeDetailsDto = {
	addedAt: string;
	userId: string;
	login: string;
};

export class likeInputDto {
	@IsString()
	@IsEnum(LikeStatus)
	likeStatus: string;
}
