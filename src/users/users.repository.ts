import { UserDto, UserType, emailConfirmationDto, passwordConfirmationDto } from './users.types';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { usersMapping } from '../utils/mapping';

@Injectable()
export class UsersRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}

	async createUser(user: UserType): Promise<UserDto> {
		const query = `
        INSERT INTO public."Users"(
            "id", "login", "email", "passwordHash", "passwordSalt", "createdAt", 
            "emailConfirmationCode", "emailExpirationDate", "emailConfirmationStatus", 
            "passwordRecoveryCode", "passwordExpirationDate")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
    `;
		const values = [
			user.id,
			user.login,
			user.email,
			user.passwordHash,
			user.passwordSalt,
			user.createdAt,
			user.emailConfirmationCode,
			user.emailExpirationDate,
			user.emailConfirmationStatus,
			user.passwordRecoveryCode,
			user.passwordExpirationDate,
		];

		try {
			const result = await this.dataSource.query(query, values);
			return usersMapping(result)[0];
		} catch (error) {
			console.error('Error creating user:', error);
		}
	}

	async findByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
		const query = `
        SELECT "id", "login", "email", "createdAt", "emailConfirmationStatus", "passwordSalt", "passwordHash"
		FROM public."Users" u
		WHERE u."login" = $1 OR u."email" = $1;
    `;

		try {
			const result = await this.dataSource.query(query, [loginOrEmail]);
			if (result.length === 0) {
				return null;
			}
			return result[0];
		} catch (error) {
			console.error('Error finding user:', error);
		}
	}

	async findByConfirmationCode(code: string): Promise<emailConfirmationDto | null> {
		const query = `
        SELECT "id", "emailConfirmationCode", "emailExpirationDate", "emailConfirmationStatus"
		FROM public."Users" u
		WHERE u."emailConfirmationCode" = $1;
    `;

		try {
			const result = await this.dataSource.query(query, [code]);
			if (result.length === 0) {
				return null;
			}
			return result[0];
		} catch (error) {
			console.error('Error finding emailConfirmationCode:', error);
			return null;
		}
	}

	async findByRecoveryCode(recoveryCode: string): Promise<passwordConfirmationDto | null> {
		const query = `
        SELECT "id", "passwordRecoveryCode", "passwordExpirationDate"
		FROM public."Users" u
		WHERE u."passwordRecoveryCode" = $1;
    `;
		try {
			const result = await this.dataSource.query(query, [recoveryCode]);
			return result;
		} catch (error) {
			console.error('Error finding recoveryCode:', error);
			return null;
		}
	}

	async updateConfirmation(id: string): Promise<true> {
		const query = `
		UPDATE public."Users" u
		SET "emailConfirmationStatus"=true
		WHERE u."id" = $1;
    `;
		try {
			return await this.dataSource.query(query, [id]);
		} catch (error) {
			console.error('Error updating emailConfirmationStatus:', error);
		}
	}

	async updateConfirmationCode(id: string): Promise<string | null> {
		const confirmationCode = uuidv4();
		const expirationDate = add(new Date(), {
			hours: 1,
			minutes: 3,
		});
		const query = `
		UPDATE public."Users" u
		SET "emailConfirmationCode"=$1, "emailExpirationDate"=$2
		WHERE u."id" = $3;
    `;
		try {
			await this.dataSource.query(query, [confirmationCode, expirationDate, id]);
			return confirmationCode;
		} catch (error) {
			console.error('Error updating emailConfirmationCode:', error);
			return null;
		}
	}

	async updatePasswordRecoveryCode(id: string): Promise<string | null> {
		const confirmationCode = uuidv4();
		const expirationDate = add(new Date(), {
			hours: 1,
			minutes: 3,
		});
		const query = `
		UPDATE public."Users" u
		SET "passwordConfirmationCode"=$1, "passwordExpirationDate"=$2
		WHERE u."id" = $3;
    `;
		try {
			await this.dataSource.query(query, [confirmationCode, expirationDate, id]);
			return confirmationCode;
		} catch (error) {
			console.error('Error updating passwordConfirmationCode:', error);
			return null;
		}
	}

	async updatePassword(id: string, passwordHash: string, passwordSalt: string) {
		const query = `
		UPDATE public."Users" u
		SET "passwordHash"=$1, "passwordSalt"=$2
		WHERE u."id" = $3;
    `;
		try {
			return await this.dataSource.query(query, [passwordHash, passwordSalt, id]);
		} catch (error) {
			console.error('Error updating password:', error);
		}
	}

	async deleteUser(id: string): Promise<boolean> {
		const query = `
		DELETE FROM public."Users" u
		WHERE u."id" = $1;
    `;

		try {
			const result = await this.dataSource.query(query, [id]);
			if (result[1] === 0) {
				return false;
			}
			return true;
		} catch (error) {
			console.error('Error deleting user:', error);
			return false;
		}
	}
}
