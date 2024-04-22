import { BlogDto, BlogInputDto, BlogType } from './blogs.types';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { blogsMapping, postsMapping } from '../utils/mapping';
import { PostViewDto, PostDto, PostInputDto } from 'src/posts/posts.types';

@Injectable()
export class BlogsRepository {
	constructor(@InjectDataSource() protected dataSource: DataSource) {}

	async createBlog(blog: BlogType): Promise<BlogDto> {
		const query = `INSERT INTO public."Blogs"(
			"id", "name", "description", "websiteUrl", "createdAt", "isMembership")
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *
        `;

		const values = [blog.id, blog.name, blog.description, blog.websiteUrl, blog.createdAt, blog.isMembership];

		try {
			const result = await this.dataSource.query(query, values);
			return blogsMapping(result)[0];
		} catch (error) {
			console.error('Error creating blog :', error);
		}
	}

	async updateBlog(id: string, inputModel: BlogInputDto): Promise<boolean> {
		const query = `
		UPDATE public."Blogs" b
		SET "name"=$1, "description"=$2, "websiteUrl"=$3
		WHERE b."id" = $4;
    `;
		const values = [inputModel.name, inputModel.description, inputModel.websiteUrl, id];

		try {
			const result = await this.dataSource.query(query, values);
			if (result[1] === 0) {
				return null;
			}
			return true;
		} catch (error) {
			console.error('Error updating blog:', error);
			return false;
		}
	}

	async deleteBlog(id: string): Promise<boolean> {
		const query = `
		DELETE FROM public."Blogs" b
        WHERE b."id" = $1
	`;

		try {
			const result = await this.dataSource.query(query, [id]);
			if (result[1] === 0) {
				return null;
			}
			return true;
		} catch (error) {
			console.error('Error deleting blog:', error);
			return null;
		}
	}

	async createPostForSpecifiedBlog(post: PostDto): Promise<PostViewDto> {
		const query = `INSERT INTO public."Posts"(
			"id", "title", "shortDescription", "content", "blogId", "blogName", "createdAt", "likesCount", "dislikesCount")
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `;

		const values = [
			post.id,
			post.title,
			post.shortDescription,
			post.content,
			post.blogId,
			post.blogName,
			post.createdAt,
			post.likesCount,
			post.dislikesCount,
		];

		try {
			const result = await this.dataSource.query(query, values);
			return postsMapping(result)[0];
		} catch (error) {
			console.error('Error creating post :', error);
		}
	}

	async updatePost(blogId: string, postId: string, inputModel: PostInputDto): Promise<boolean> {
		const query = `
		UPDATE public."Posts" p
		SET "title"=$1, "shortDescription"=$2, "content"=$3, "blogId"=$4
		WHERE p."id" = $5;
    `;
		try {
			const result = await this.dataSource.query(query, [
				inputModel.title,
				inputModel.shortDescription,
				inputModel.content,
				blogId,
				postId,
			]);
			if (result[1] === 0) {
				return false;
			}
			return true;
		} catch (error) {
			console.error('Error updating post:', error);
			return false;
		}
	}

	async deletePost(id: string): Promise<true | null> {
		const query = `
		DELETE FROM public."Posts" p
		WHERE p."id" = $1;
    `;

		try {
			const result = await this.dataSource.query(query, [id]);
			if (result[1] === 0) {
				return null;
			}
			return true;
		} catch (error) {
			console.error('Error deleting post:', error);
			return null;
		}
	}
}
