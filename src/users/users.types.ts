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

export type UserType = {
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
};

export type emailConfirmationDto = {
	id: string;
	emailConfirmationCode: string;
	emailExpirationDate: Date;
	emailConfirmationStatus: boolean;
};

export type passwordConfirmationDto = {
	id: string;
	passwordRecoveryCode: string;
	passwordExpirationDate: Date;
};
