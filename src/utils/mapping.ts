import { PostLike } from '../likes/post-like.entity';
import { Post, likeDetails } from '../posts/post.entity';
import { BlogType } from '../blogs/blogs.types';
import { PostDto } from '../posts/posts.types';
import { CommentDto } from '../comments/comments.types';
import { User } from '../users/domain/user.entity';
import { Device } from '../devices/device.entity';
import { Blog } from '../blogs/domain/blog.entity';
import { Comment } from '../comments/domain/comment.entity';

export const blogsMapping = (array: BlogType[]) => {
	return array.map((b: BlogType) => Blog.getViewBlog(b));
};

export const postsMapping = (array: PostDto[]) => {
	return array.map((p: PostDto) => Post.getViewPost(p));
};

export const usersMapping = (array: User[]) => {
	return array.map((u: User) => User.getViewUser(u));
};

export const commentsMapping = (array: CommentDto[]) => {
	return array.map((c: CommentDto) => Comment.getViewComment(c));
};

export const devicesMapping = (array: Device[]) => {
	return array.map((d: Device) => Device.getViewDevice(d));
};

export const likeDetailsMapping = (array: likeDetails[]) => {
	return array.map((d: likeDetails) => PostLike.getViewLikeDetails(d));
};
