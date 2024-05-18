import { Length } from 'class-validator';
import { likeDetails } from './post.entity';
import { Transform } from 'class-transformer';
import validator from 'validator';

export class PostInputDto {
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 30)
	title: string;
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 100)
	shortDescription: string;
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 1000)
	content: string;
}

export class SpecifiedPostInputDto {
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 30)
	title: string;
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 100)
	shortDescription: string;
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 1000)
	content: string;
}

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
		newestLikes: likeDetails[];
	};
};

export type postsPaginationDto = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: PostViewDto[];
};

export class PostType {
	id: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	createdAt: Date;
}

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
