import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { format } from 'date-fns';
import { Device } from '../devices/device.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 10, unique: true })
	login: string;

	@Column({ type: 'varchar', length: 30, unique: true })
	email: string;

	@Column({ type: 'varchar' })
	passwordHash: string;

	@Column({ type: 'varchar' })
	passwordSalt: string;

	@CreateDateColumn({ type: 'timestamp with time zone' })
	createdAt: Date;

	@Column({ type: 'varchar' })
	emailConfirmationCode: string;

	@Column({ type: 'varchar' })
	emailExpirationDate: Date;

	@Column({ type: 'bool' })
	emailConfirmationStatus: boolean;

	@Column({ type: 'varchar' })
	passwordRecoveryCode: string;

	@Column({ type: 'varchar' })
	passwordExpirationDate: Date;

	@OneToMany(() => Device, (device) => device.user)
	device: Device[];

	static getViewUser(userFromDb: User) {
		return {
			id: userFromDb.id,
			login: userFromDb.login,
			email: userFromDb.email,
			createdAt: format(userFromDb.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
		};
	}
}
