import { BlogDto, BlogType } from '../blogs.types';
import { BlogInputDto } from '../blogs.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostType } from 'src/posts/posts.types';
import { PostInputDto } from 'src/posts/posts.dto';
import { Blog } from '../domain/blog.entity';
import { Post } from '../../posts/domain/post.entity';

@Injectable()
export class BlogsRepository {
	constructor(
		@InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>,
		@InjectRepository(Post) private readonly postsRepository: Repository<Post>
	) {}

	async createBlog(blog: BlogType): Promise<BlogDto> {
		try {
			const result = await this.blogsRepository.save(blog);
			return Blog.getViewBlog(result);
		} catch (error) {
			console.error('Error creating blog :', error);
		}
	}

	async updateBlog(id: string, inputModel: BlogInputDto): Promise<boolean> {
		try {
			const blog = await this.blogsRepository
				.createQueryBuilder('b')
				.where('b.id = :blogId', {
					blogId: id,
				})
				.getOne();

			blog.name = inputModel.name;
			blog.description = inputModel.description;
			blog.websiteUrl = inputModel.websiteUrl;

			await this.blogsRepository.save(blog);
			return true;
		} catch (error) {
			console.error('Error updating blog:', error);
			return false;
		}
	}

	async deleteBlog(id: string): Promise<boolean> {
		try {
			const result = await this.blogsRepository
				.createQueryBuilder('b')
				.delete()
				.from(Blog)
				.where('id = :blogId', { blogId: id })
				.execute();
			return result.affected === 1;
		} catch (error) {
			console.error('Error deleting blog:', error);
			return false;
		}
	}

	async createPostForSpecifiedBlog(post: PostType) {
		try {
			const postInfo = await this.postsRepository.save(post);
			const blogInfo = await this.postsRepository
				.createQueryBuilder('p')
				.leftJoin('p.blog', 'b')
				.select(['p.id', 'p.title', 'p.shortDescription', 'p.content', 'p.blogId', 'p.createdAt', 'b.name'])
				.where(`p.blogId = :id`, {
					id: post.blogId,
				})
				.getOne();
			const blogName = blogInfo.blog.name;
			const result = {
				...postInfo,
				blogName,
				likesCount: 0,
				dislikesCount: 0,
				myStatus: 'None',
				newestLikes: [],
			};
			return Post.getViewPost(result);
		} catch (error) {
			console.error('Error creating post :', error);
		}
	}

	async updatePost(postId: string, inputModel: PostInputDto): Promise<boolean> {
		try {
			const post = await this.postsRepository
				.createQueryBuilder('p')
				.where('p.id = :postId', {
					postId: postId,
				})
				.getOne();
			console.log(post);
			post.title = inputModel.title;
			post.shortDescription = inputModel.shortDescription;
			post.content = inputModel.content;

			await this.postsRepository.save(post);
			return true;
		} catch (error) {
			console.error('Error updating post:', error);
			return false;
		}
	}

	async deletePost(id: string): Promise<boolean> {
		try {
			const result = await this.postsRepository
				.createQueryBuilder('p')
				.delete()
				.from(Post)
				.where('id = :postId', { postId: id })
				.execute();
			return result.affected === 1;
		} catch (error) {
			console.error('Error deleting post:', error);
			return false;
		}
	}
}
