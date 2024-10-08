import { Post } from '../../posts/domain/post.entity';
import { likeDetails } from '../likes.types';
import { likeDetailsDto } from '../likes.types';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/domain/user.entity';

@Entity('postLikes')
export class PostLike {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar' })
	postId: string;

	@Column({ type: 'varchar' })
	status: string;

	@Column({ type: 'varchar' })
	userId: string;

	@Column({ type: 'timestamp with time zone' })
	addedAt: Date;

	@ManyToOne(() => Post, (post) => post.postLike, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	post: Post;

	@ManyToOne(() => User, (user) => user.postLike, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	user: User;

	static getViewLikeDetails(likeDetails: likeDetails): likeDetailsDto {
		return {
			addedAt: likeDetails.addedAt,
			userId: likeDetails.userId,
			login: likeDetails.user.login,
		};
	}
}
