import { IsEmail, IsString, Length, Matches, Validate } from 'class-validator';
import {
	confirmationCodeExistsRule,
	emailConfirmedRule,
	emailExistsRule,
	loginExistsRule,
	recoveryCodeExistsRule,
} from '../auth/authentification';
import { format } from 'date-fns';
export const loginPattern = /^[a-zA-Z0-9_-]*$/;

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
	@IsEmail()
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
	sortDirection: string;
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

	static getViewUser(userFromDb: UserType) {
		return {
			id: userFromDb.id,
			login: userFromDb.login,
			email: userFromDb.email,
			createdAt: format(userFromDb.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
		};
	}
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
