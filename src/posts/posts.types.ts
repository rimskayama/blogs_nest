import { IsString, Length } from 'class-validator';
import { likeDetails } from './post.entity';

export class PostInputDto {
	@IsString()
	@Length(1, 30)
	title: string;
	@IsString()
	@Length(1, 100)
	shortDescription: string;
	@IsString()
	@Length(1, 1000)
	content: string;
	@IsString()
	blogId: string;
}

export type PostDto = {
	id: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: string;
	extendedLikesInfo: {
		likesCount: number;
		dislikesCount: number;
		myStatus: string;
		newestLikes: likeDetails[];
	};
};

export type postsPaginationDto = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: PostDto[];
};
