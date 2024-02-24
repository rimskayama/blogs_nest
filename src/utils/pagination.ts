import { Sort } from 'mongodb';
import { QueryParameters } from 'src/users/users.types';

export const getPagination = (query: QueryParameters) => {
	const page: number = Number(query.pageNumber) || 1;
	const limit: number = Number(query.pageSize) || 10;
	const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
	const sortBy = query.sortBy || 'createdAt';
	let sortByUsers: string;
	if (query.sortBy) {
		sortByUsers = 'accountData.' + query.sortBy;
	} else sortByUsers = 'accountData.createdAt';
	const searchNameTerm = query.searchNameTerm || '';
	const searchLoginTerm = query.searchLoginTerm || '';
	const searchEmailTerm = query.searchEmailTerm || '';

	const skip: number = (page - 1) * limit;

	return { page, limit, sortDirection, sortBy, sortByUsers, skip, searchNameTerm, searchLoginTerm, searchEmailTerm };
};
