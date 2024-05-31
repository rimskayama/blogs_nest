import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UsersRepository } from '../users/repositories/users.repository';
import { BlogsQueryRepository } from '../blogs/blogs.query.repository';

@ValidatorConstraint({ name: 'blogDoesNotExist', async: true })
@Injectable()
export class blogDoesNotExistRule implements ValidatorConstraintInterface {
	constructor(private BlogsQueryRepository: BlogsQueryRepository) {}

	async validate(id: string) {
		try {
			const blog = await this.BlogsQueryRepository.findBlogById(id);
			if (blog) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}

	defaultMessage() {
		return 'Blog does not exists';
	}
}

@ValidatorConstraint({ name: 'EmailExists', async: true })
@Injectable()
export class emailExistsRule implements ValidatorConstraintInterface {
	constructor(private usersRepository: UsersRepository) {}

	async validate(email: string) {
		try {
			const user = await this.usersRepository.findByLoginOrEmail(email);
			if (user) {
				return false;
			} else {
				return true;
			}
		} catch (e) {
			return true;
		}
	}

	defaultMessage() {
		return 'User with that email already exists';
	}
}

@ValidatorConstraint({ name: 'LoginExists', async: true })
@Injectable()
export class loginExistsRule implements ValidatorConstraintInterface {
	constructor(private usersRepository: UsersRepository) {}

	async validate(login: string) {
		try {
			const user = await this.usersRepository.findByLoginOrEmail(login);
			if (user) {
				return false;
			} else {
				return true;
			}
		} catch (e) {
			return true;
		}
	}

	defaultMessage() {
		return 'User with that login already exists';
	}
}

@ValidatorConstraint({ name: 'EmailConfirmed', async: true })
@Injectable()
export class emailConfirmedRule implements ValidatorConstraintInterface {
	constructor(private usersRepository: UsersRepository) {}

	async validate(email: string) {
		try {
			const user = await this.usersRepository.findByLoginOrEmail(email);
			if (!user) {
				return false;
			}

			if (user.emailConfirmationStatus === true) {
				return false;
			} else {
				return true;
			}
		} catch (e) {
			return false;
		}
	}

	defaultMessage() {
		return 'Your email was already confirmed';
	}
}

@ValidatorConstraint({ name: 'ConfirmationCodeExists', async: true })
@Injectable()
export class confirmationCodeExistsRule implements ValidatorConstraintInterface {
	constructor(private usersRepository: UsersRepository) {}

	async validate(confirmationCode: string) {
		try {
			const user = await this.usersRepository.findByConfirmationCode(confirmationCode);
			if (!user) {
				return false;
			}
			if (user.emailConfirmationStatus === true || user.emailExpirationDate < new Date()) {
				return false;
			}
		} catch (e) {
			return false;
		}

		return true;
	}

	defaultMessage() {
		return 'Your confirmation code is incorrect';
	}
}

@ValidatorConstraint({ name: 'RecoveryCodeExists', async: true })
@Injectable()
export class recoveryCodeExistsRule implements ValidatorConstraintInterface {
	constructor(private usersRepository: UsersRepository) {}

	async validate(recoveryCode: string) {
		try {
			await this.usersRepository.findByRecoveryCode(recoveryCode);
		} catch (e) {
			return false;
		}

		return true;
	}

	defaultMessage() {
		return 'Your recovery code is incorrect';
	}
}
