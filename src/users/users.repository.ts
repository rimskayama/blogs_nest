import { UserDto, UserType, emailConfirmationDto, passwordConfirmationDto } from './users.types';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
	constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

	async createUser(user: UserType): Promise<UserDto> {
		try {
			const result = await this.usersRepository.save(user);
			return User.getViewUser(result);
		} catch (error) {
			console.error('Error creating user:', error);
		}
	}

	async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
		try {
			const result = await this.usersRepository
				.createQueryBuilder('u')
				.where(`u.login = :login`, {
					login: loginOrEmail,
				})
				.orWhere(`u.email = :email`, {
					email: loginOrEmail,
				})
				.getOne();
			return result;
		} catch (error) {
			console.error('Error finding user:', error);
		}
	}

	async findByConfirmationCode(code: string): Promise<emailConfirmationDto | null> {
		try {
			const result = await this.usersRepository
				.createQueryBuilder('u')
				.select(['u.id', 'u.emailConfirmationCode', 'u.emailExpirationDate', 'u.emailConfirmationStatus'])
				.where(`u.emailConfirmationCode = :code`, {
					code: code,
				})
				.getOne();
			return result;
		} catch (error) {
			console.error('Error finding emailConfirmationCode:', error);
			return null;
		}
	}

	async findByRecoveryCode(recoveryCode: string): Promise<passwordConfirmationDto | null> {
		try {
			const result = await this.usersRepository
				.createQueryBuilder('u')
				.select(['u.id', 'u.passwordRecoveryCode', 'u.passwordExpirationDate'])
				.where(`u.passwordRecoveryCode = :code`, {
					code: recoveryCode,
				})
				.getOne();
			return result;
		} catch (error) {
			console.error('Error finding recoveryCode:', error);
			return null;
		}
	}

	async updateConfirmation(id: string): Promise<true> {
		try {
			const user = await this.usersRepository
				.createQueryBuilder('u')
				.where('u.id = :userId', {
					userId: id,
				})
				.getOne();
			user.emailConfirmationStatus = true;
			await this.usersRepository.save(user);
			return true;
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
		try {
			const user = await this.usersRepository
				.createQueryBuilder('u')
				.where(`u.id = :userId`, {
					userId: id,
				})
				.getOne();
			user.emailConfirmationCode = confirmationCode;
			user.emailExpirationDate = expirationDate;
			await this.usersRepository.save(user);
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
		try {
			await this.usersRepository
				.createQueryBuilder('u')
				.update('u')
				.set({
					passwordConfirmationCode: confirmationCode,
					passwordExpirationDate: expirationDate,
				})
				.where(`u.id = :userId`, {
					userId: id,
				});
			return confirmationCode;
		} catch (error) {
			console.error('Error updating passwordConfirmationCode:', error);
			return null;
		}
	}

	async updatePassword(id: string, passwordHash: string, passwordSalt: string) {
		try {
			await this.usersRepository
				.createQueryBuilder('u')
				.update('u')
				.set({
					passwordHash: passwordHash,
					passwordSalt: passwordSalt,
				})
				.where(`u.id = :userId`, {
					userId: id,
				});
			return true;
		} catch (error) {
			console.error('Error updating password:', error);
		}
	}

	async deleteUser(id: string): Promise<boolean> {
		try {
			const result = await this.usersRepository
				.createQueryBuilder('u')
				.delete()
				.from(User)
				.where('id = :userId', { userId: id })
				.execute();
			return result.affected === 1;
		} catch (error) {
			console.error('Error deleting user:', error);
		}
	}
}
