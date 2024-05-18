import { PostLike } from '../likes/like.entity';
import { Post, likeDetails } from '../posts/post.entity';
import { BlogType } from '../blogs/blogs.types';
import { PostDto } from '../posts/posts.types';
import { CommentType } from '../comments/comments.types';
import { User } from '../users/user.entity';
import { Device } from '../devices/device.entity';
import { Blog } from '../blogs/blog.entity';

export const blogsMapping = (array: BlogType[]) => {
	return array.map((b: BlogType) => Blog.getViewBlog(b));
};

export const postsMapping = (array: PostDto[]) => {
	return array.map((p: PostDto) => Post.getViewPost(p));
};

export const usersMapping = (array: User[]) => {
	return array.map((u: User) => User.getViewUser(u));
};

export const commentsMapping = (array: CommentType[]) => {
	return array.map((c: CommentType) => CommentType.getViewComment(c));
};

export const devicesMapping = (array: Device[]) => {
	return array.map((d: Device) => Device.getViewDevice(d));
};

export const likeDetailsMapping = (array: likeDetails[]) => {
	return array.map((d: likeDetails) => PostLike.getViewLikeDetails(d));
};
