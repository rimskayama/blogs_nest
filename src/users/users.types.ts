export type UserDto = {
	id: string;
	login: string;
	email: string;
	createdAt: string;
};

export type UserFromGuard = {
	id: string;
	login: string;
};

export type UsersPaginationDto = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: UserDto[];
};

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

export class UserType {
	id: string;

	login: string;

	email: string;

	passwordHash: string;

	passwordSalt: string;

	createdAt: Date;

	emailConfirmationCode: string;

	emailExpirationDate: Date;

	emailConfirmationStatus: boolean;

	passwordRecoveryCode: string;

	passwordExpirationDate: Date;
}

export class emailConfirmationDto {
	id: string;
	emailConfirmationCode: string;
	emailExpirationDate: Date;
	emailConfirmationStatus: boolean;
}

export class passwordConfirmationDto {
	id: string;
	passwordRecoveryCode: string;
	passwordExpirationDate: Date;
}
