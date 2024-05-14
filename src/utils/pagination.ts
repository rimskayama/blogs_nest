import { QueryParameters } from '../users/users.types';

export const getPagination = (query: QueryParameters) => {
	const page: number = Number(query.pageNumber) || 1;
	const limit: number = Number(query.pageSize) || 10;
	const sortDirection = query.sortDirection || 'DESC';
	const sortBy: string = query.sortBy || 'createdAt';
	const searchNameTerm = query.searchNameTerm || '';
	const searchLoginTerm = query.searchLoginTerm || '';
	const searchEmailTerm = query.searchEmailTerm || '';

	const skip: number = (page - 1) * limit;

	return { page, limit, sortDirection, sortBy, skip, searchNameTerm, searchLoginTerm, searchEmailTerm };
};
