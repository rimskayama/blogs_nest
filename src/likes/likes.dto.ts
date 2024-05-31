import { IsEnum } from 'class-validator';
import { LikeStatus } from './likes.types';

export class likeInputDto {
	@IsEnum(LikeStatus)
	likeStatus: LikeStatus;
}
