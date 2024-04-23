import { Length } from 'class-validator';
import { likeDetails } from './post.entity';
import { Transform } from 'class-transformer';
import validator from 'validator';
import { LikeStatus } from '../likes/likes.types';

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

export class PostDto {
	id: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: Date;
	likesCount: number;
	dislikesCount: number;
}

export class PostType {
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

	static getViewPost(postFromDb: PostType): PostViewDto {
		return {
			id: postFromDb.id,
			title: postFromDb.title,
			shortDescription: postFromDb.shortDescription,
			content: postFromDb.content,
			blogId: postFromDb.blogId,
			blogName: postFromDb.blogName,
			createdAt: postFromDb.createdAt.toISOString(),
			extendedLikesInfo: {
				likesCount: postFromDb.likesCount,
				dislikesCount: postFromDb.dislikesCount,
				myStatus: postFromDb.myStatus || LikeStatus.None,
				newestLikes: postFromDb.newestLikes || [],
			},
		};
	}
}
