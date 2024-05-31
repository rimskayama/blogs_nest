export class QueryParameters {
	pageNumber: number;
	pageSize: number;
	sortDirection: 'ASC' | 'DESC';
	sortBy: string;
	searchNameTerm: string;
	searchLoginTerm: string;
	searchEmailTerm: string;
	skip: number;
}

export type PaginationDto<T> = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: T[];
};
