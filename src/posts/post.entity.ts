import { Prop, Schema } from '@nestjs/mongoose';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostViewDto, PostDto } from './posts.types';
import { Blog } from '../blogs/blog.entity';
import { LikeStatus } from '../likes/likes.types';

@Schema()
export class likeDetails {
	@Prop({})
	addedAt: string;

	@Prop({})
	userId: string;

	@Prop({})
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
