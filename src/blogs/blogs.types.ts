import { IsString, IsUrl, Length } from 'class-validator';

export class BlogInputDto {
	@IsString()
	@Length(1, 15)
	name: string;
	@IsString()
	@Length(1, 500)
	description: string;
	@IsString()
	@Length(1, 100)
	@IsUrl()
	websiteUrl: string;
}

export type BlogDto = {
	id: string;
	name: string;
	description: string;
	websiteUrl: string;
	isMembership: boolean | false;
	createdAt: string;
};

export type BlogsPaginationDto = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: BlogDto[];
};
