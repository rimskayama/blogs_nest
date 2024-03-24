import { Length, Validate } from 'class-validator';
import { likeDetails } from './post.entity';
import { Transform } from 'class-transformer';
import validator from 'validator';
import { blogDoesNotExistRule } from '../auth/authentification';

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
	@Transform(({ value }) => validator.trim(value))
	@Validate(blogDoesNotExistRule)
	blogId: string;
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
