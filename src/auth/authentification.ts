import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UsersRepository } from '../users/users.repository';

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
				return true;
			}

			if (user.emailConfirmation.isConfirmed === true) {
				return false;
			} else {
				return true;
			}
		} catch (e) {
			return true;
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
			if (user.emailConfirmation.isConfirmed === true) {
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
