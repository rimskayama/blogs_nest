import { likeDetails, likeDetailsDto } from '../likes/likes.types';

export type PostViewDto = {
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
		newestLikes: likeDetailsDto[];
	};
};

export type postsPaginationDto = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: PostViewDto[];
};

export type PostType = {
	id: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	createdAt: Date;
};

export type PostDto = {
	id: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: Date;
	likesCount: number;
	dislikesCount: number;
	myStatus: string;
	newestLikes: likeDetails[];
};
