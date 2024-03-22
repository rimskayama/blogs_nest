import { Blog } from '../blogs/blog.entity';
import { Device } from '../devices/device.entity';
import { PostLike } from '../likes/like.entity';
import { Post, likeDetails } from '../posts/post.entity';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';

export const blogsMapping = (array: Blog[]) => {
	return array.map((b: Blog) => Blog.getViewBlog(b));
};

export const postsMapping = (array: Post[]) => {
	return array.map((p: Post) => Post.getViewPost(p));
};

export const usersMapping = (array: User[]) => {
	return array.map((u: User) => User.getViewUser(u));
};

export const commentsMapping = (array: Comment[]) => {
	return array.map((c: Comment) => Comment.getViewComment(c));
};

export const devicesMapping = (array: Device[]) => {
	return array.map((d: Device) => Device.getViewDevice(d));
};

export const likeDetailsMapping = (array: likeDetails[]) => {
	return array.map((d: likeDetails) => PostLike.getViewLikeDetails(d));
};
