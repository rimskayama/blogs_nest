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
