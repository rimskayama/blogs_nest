import { Post } from '../posts/post.entity';
import { BlogDto, BlogType } from './blogs.types';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blogs')
export class Blog {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar' })
	name: string;

	@Column({ type: 'varchar' })
	description: string;

	@Column({ type: 'varchar' })
	websiteUrl: string;

	@Column({ type: 'timestamp with time zone' })
	createdAt: Date;

	@Column({ type: 'bool' })
	isMembership: boolean;

	@OneToMany(() => Post, (post) => post.blog)
	@JoinColumn()
	post: Post;

	static getViewBlog(blogFromDb: BlogType): BlogDto {
		return {
			id: blogFromDb.id,
			name: blogFromDb.name,
			description: blogFromDb.description,
			websiteUrl: blogFromDb.websiteUrl,
			isMembership: blogFromDb.isMembership,
			createdAt: blogFromDb.createdAt.toISOString(),
		};
	}
}
