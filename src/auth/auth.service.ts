import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto, UserInputDto } from '../users/users.types';
import { ObjectId } from 'mongodb';
import { User } from '../users/user.entity';
import { emailManager } from './guards/registration/email.manager';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly usersRepository: UsersRepository,
		private readonly jwtService: JwtService
	) {}

	async validateUser(loginOrEmail: string, password: string): Promise<null | User> {
		const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
		let confirmation: boolean;
		try {
			confirmation = user.emailConfirmation.isConfirmed;
		} catch (e) {
			return null;
		}
		if (!user || !confirmation) return null;
		const passwordHash = await this.usersService._generateHash(password, user.accountData.passwordSalt);
		if (user.accountData.passwordHash !== passwordHash) {
			return null;
		}
		return user;
	}

	async registerUser(inputModel: UserInputDto): Promise<UserDto | boolean> {
		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await this.usersService._generateHash(inputModel.password, passwordSalt);

		const newUser = {
			_id: new ObjectId(),
			accountData: {
				login: inputModel.login,
				email: inputModel.email,
				passwordHash: passwordHash,
				passwordSalt: passwordSalt,
				createdAt: new Date().toISOString(),
			},
			emailConfirmation: {
				confirmationCode: uuidv4(),
				expirationDate: new Date(),
				isConfirmed: false,
			},
			passwordConfirmation: {
				recoveryCode: uuidv4(),
				expirationDate: add(new Date(), {
					hours: 1,
					minutes: 3,
				}),
			},
		};
		const result = this.usersRepository.createUser(newUser);

		try {
			await emailManager.sendRegistrationEmail(newUser.accountData.email, newUser.emailConfirmation.confirmationCode);
		} catch (error) {
			console.error('error in send email:', error);
		}
		return result;
	}

	async login(userId: string, deviceId: string) {
		const accessPayload = { sub: new ObjectId(userId) };
		const refreshPayload = { sub: new ObjectId(userId), deviceId: deviceId };
		const accessToken = this.jwtService.sign(accessPayload, {
			secret: jwtConstants.accessTokenSecret,
			expiresIn: jwtConstants.accessTokenExpirationTime,
		});
		const refreshToken = this.jwtService.sign(refreshPayload, {
			secret: jwtConstants.refreshTokenSecret,
			expiresIn: jwtConstants.refreshTokenExpirationTime,
		});

		return {
			accessToken,
			refreshToken,
		};
	}

	async confirmEmail(code: string): Promise<boolean> {
		const foundUserByCode = await this.usersRepository.findByConfirmationCode(code);

		if (!foundUserByCode) return false;

		if (foundUserByCode.emailConfirmation.isConfirmed) {
			return false;
		} else {
			if (
				foundUserByCode.emailConfirmation.confirmationCode === code &&
				foundUserByCode.emailConfirmation.expirationDate > new Date()
			) {
				return await this.usersRepository.updateConfirmation(foundUserByCode._id);
			} else return false;
		}
	}

	async resendEmail(email: string): Promise<boolean> {
		const foundUser = await this.usersRepository.findByLoginOrEmail(email);

		if (foundUser) {
			const userWithUpdatedCode = await this.usersRepository.updateConfirmationCode(foundUser._id);

			if (userWithUpdatedCode) {
				await emailManager.resendEmail(email, userWithUpdatedCode.emailConfirmation.confirmationCode);
				return true;
			}
			return false;
		}
		return true;
	}

	async sendPasswordRecoveryEmail(email: string): Promise<boolean> {
		const user = await this.usersRepository.findByLoginOrEmail(email);

		if (user) {
			const userWithUpdatedCode = await this.usersRepository.updatePasswordRecoveryCode(user._id);
			try {
				await emailManager.sendPasswordRecoveryEmail(email, userWithUpdatedCode!.passwordConfirmation.recoveryCode);
				return true;
			} catch (error) {
				console.error('mail error');
				return false;
			}
		} else return true;
	}

	async confirmRecoveryCode(recoveryCode: string): Promise<string | false> {
		const userByCode = await this.usersRepository.findByRecoveryCode(recoveryCode);

		if (!userByCode) return false;

		if (
			userByCode.passwordConfirmation.recoveryCode === recoveryCode &&
			userByCode.passwordConfirmation.expirationDate > new Date()
		) {
			return userByCode._id.toString();
		} else return false;
	}

	async updatePassword(userId: string, newPassword: string): Promise<boolean> {
		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await this.usersService._generateHash(newPassword, passwordSalt);
		return await this.usersRepository.updatePassword(new ObjectId(userId), passwordHash, passwordSalt);
	}
}
