import { CommentViewDto, CommentDto } from '../comments.types';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/post.entity';
import { User } from '../../users/domain/user.entity';
import { LikeStatus } from '../../likes/likes.types';
import { CommentLike } from '../../likes/comment-like.entity';

@Entity('comments')
export class Comment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar' })
	postId: string;

	@ManyToOne(() => Post, (post) => post.comment)
	@JoinColumn()
	post: Post;

	@Column({ type: 'varchar' })
	content: string;

	@Column({ type: 'timestamp with time zone' })
	createdAt: Date;

	@Column({ type: 'varchar' })
	userId: string;

	@ManyToOne(() => User, (user) => user.comment)
	@JoinColumn()
	user: User;

	@OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
	commentLike: CommentLike[];

	static getViewComment(commentFromDb: CommentDto): CommentViewDto {
		return {
			id: commentFromDb.id,
			content: commentFromDb.content,
			commentatorInfo: {
				userId: commentFromDb.userId,
				userLogin: commentFromDb.userLogin,
			},
			createdAt: commentFromDb.createdAt.toISOString(),
			likesInfo: {
				likesCount: commentFromDb.likesCount || 0,
				dislikesCount: commentFromDb.dislikesCount || 0,
				myStatus: commentFromDb.myStatus || LikeStatus.None,
			},
		};
	}
}
