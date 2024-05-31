import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { format } from 'date-fns';
import { Device } from '../../devices/domain/device.entity';
import { Comment } from '../../comments/domain/comment.entity';
import { CommentLike } from '../../likes/comment-like.entity';
import { PostLike } from '../../likes/post-like.entity';

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

	@Column({ type: 'timestamp with time zone' })
	emailExpirationDate: Date;

	@Column({ type: 'bool' })
	emailConfirmationStatus: boolean;

	@Column({ type: 'varchar' })
	passwordRecoveryCode: string;

	@Column({ type: 'timestamp with time zone' })
	passwordExpirationDate: Date;

	@OneToMany(() => Device, (device) => device.user)
	device: Device[];

	@OneToMany(() => Comment, (comment) => comment.user)
	@JoinColumn()
	comment: Comment[];

	@OneToMany(() => CommentLike, (commentLike) => commentLike.user)
	commentLike: CommentLike[];

	@OneToMany(() => PostLike, (postLike) => postLike.user)
	postLike: PostLike[];

	static getViewUser(userFromDb: User) {
		return {
			id: userFromDb.id,
			login: userFromDb.login,
			email: userFromDb.email,
			createdAt: format(userFromDb.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
		};
	}
}
