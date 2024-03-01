import { IsEmail, IsString, Length, Matches, Validate } from 'class-validator';
import { Sort } from 'mongodb';
import {
	confirmationCodeExistsRule,
	emailConfirmedRule,
	emailExistsRule,
	loginExistsRule,
	recoveryCodeExistsRule,
} from '../auth/authentification';
const loginPattern = /^[a-zA-Z0-9_-]*$/;

export class UserInputDto {
	@IsString()
	@Length(3, 10)
	@Matches(loginPattern, {
		message: 'Login must be in correct format',
	})
	@Validate(loginExistsRule)
	login: string;
	@IsString()
	@Length(6, 20)
	password: string;
	@IsString()
	@IsEmail()
	@Validate(emailExistsRule)
	email: string;
}

export class newPasswordInputDto {
	@IsString()
	@Length(6, 20)
	newPassword: string;
	@IsString()
	@Validate(recoveryCodeExistsRule)
	recoveryCode: string;
}

export class emailInputDto {
	@IsString()
	@Validate(emailConfirmedRule)
	email: string;
}

export class confirmationCodeInputDto {
	@IsString()
	@Validate(confirmationCodeExistsRule)
	code: string;
}

export type UserDto = {
	id: string;
	login: string;
	email: string;
	createdAt: string;
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
	sortDirection: Sort;
	sortBy: string;
	sortByUsers: string;
	searchNameTerm: string;
	searchLoginTerm: string;
	searchEmailTerm: string;
	skip: number;
}
