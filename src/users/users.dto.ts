import { IsEmail, IsString, Length, Matches, Validate } from 'class-validator';
import {
	confirmationCodeExistsRule,
	emailConfirmedRule,
	emailExistsRule,
	loginExistsRule,
	recoveryCodeExistsRule,
} from '../auth/authentification';
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
