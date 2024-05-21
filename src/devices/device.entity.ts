import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceDto } from './devices.types';
import { User } from '../users/user.entity';

@Entity('devices')
export class Device {
	@PrimaryGeneratedColumn('uuid')
	deviceId: string;

	@Column({ type: 'varchar' })
	ip: string;

	@Column({ type: 'varchar' })
	title: string;

	@Column({ type: 'integer' })
	lastActiveDate: number;

	@Column({ type: 'integer' })
	tokenExpirationDate: number;

	@Column({ type: 'varchar' })
	userId: string;

	@ManyToOne(() => User, (user) => user.device, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	user: User[];

	static getViewDevice(deviceFromDb: Device): DeviceDto {
		return {
			ip: deviceFromDb.ip,
			title: deviceFromDb.title,
			lastActiveDate: new Date(deviceFromDb.lastActiveDate * 1000).toISOString(),
			deviceId: deviceFromDb.deviceId,
		};
	}
}
