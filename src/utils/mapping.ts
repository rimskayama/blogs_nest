import { PostLike } from '../likes/like.entity';
import { likeDetails } from '../posts/post.entity';
import { DeviceType } from '../devices/devices.types';
import { BlogType } from '../blogs/blogs.types';
import { PostType } from '../posts/posts.types';
import { CommentType } from '../comments/comments.types';
import { User } from '../users/user.entity';

export const blogsMapping = (array: BlogType[]) => {
	return array.map((b: BlogType) => BlogType.getViewBlog(b));
};

export const postsMapping = (array: PostType[]) => {
	return array.map((p: PostType) => PostType.getViewPost(p));
};

export const usersMapping = (array: User[]) => {
	return array.map((u: User) => User.getViewUser(u));
};

export const commentsMapping = (array: CommentType[]) => {
	return array.map((c: CommentType) => CommentType.getViewComment(c));
};

export const devicesMapping = (array: DeviceType[]) => {
	return array.map((d: DeviceType) => DeviceType.getViewDevice(d));
};

export const likeDetailsMapping = (array: likeDetails[]) => {
	return array.map((d: likeDetails) => PostLike.getViewLikeDetails(d));
};
