import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/domain/user.entity';

@Entity('commentLikes')
export class CommentLike {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar' })
	commentId: string;

	@Column({ type: 'varchar' })
	status: string;

	@Column({ type: 'varchar' })
	userId: string;

	@Column({ type: 'timestamp with time zone' })
	addedAt: Date;

	@ManyToOne(() => Comment, (comment) => comment.commentLike, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	comment: Comment;

	@ManyToOne(() => User, (user) => user.commentLike, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	user: User;
}
