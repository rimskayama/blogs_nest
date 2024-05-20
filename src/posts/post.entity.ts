import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostViewDto, PostDto } from './posts.types';
import { Blog } from '../blogs/blog.entity';
import { LikeStatus } from '../likes/likes.types';
import { Comment } from '../comments/comment.entity';

export class likeDetails {
	addedAt: string;

	userId: string;

	login: string;
}

@Entity('posts')
export class Post {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar' })
	title: string;

	@Column({ type: 'varchar' })
	shortDescription: string;

	@Column({ type: 'varchar' })
	content: string;

	@Column({ type: 'timestamp with time zone' })
	createdAt: Date;

	@Column({ type: 'varchar' })
	blogId: string;

	@ManyToOne(() => Blog, (blog) => blog.post, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	blog: Blog;

	@OneToMany(() => Comment, (comment) => comment.post, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	comment: Comment[];

	static getViewPost(postFromDb: PostDto): PostViewDto {
		return {
			id: postFromDb.id,
			title: postFromDb.title,
			shortDescription: postFromDb.shortDescription,
			content: postFromDb.content,
			blogId: postFromDb.blogId,
			blogName: postFromDb.blogName,
			createdAt: postFromDb.createdAt.toISOString(),
			extendedLikesInfo: {
				likesCount: postFromDb.likesCount,
				dislikesCount: postFromDb.dislikesCount,
				myStatus: postFromDb.myStatus || LikeStatus.None,
				newestLikes: postFromDb.newestLikes || [],
			},
		};
	}
}
