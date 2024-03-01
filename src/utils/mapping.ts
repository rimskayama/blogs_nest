import { Blog } from '../blogs/blog.entity';
import { PostLike } from '../likes/like.entity';
import { Post, likeDetails } from '../posts/post.entity';
import { User } from '../users/user.entity';

export const blogsMapping = (array: Blog[]) => {
	return array.map((b: Blog) => Blog.getViewBlog(b));
};

export const postsMapping = (array: Post[]) => {
	return array.map((p: Post) => Post.getViewPost(p));
};

export const usersMapping = (array: User[]) => {
	return array.map((u: User) => User.getViewUser(u));
};

export const likeDetailsMapping = (array: likeDetails[]) => {
	return array.map((d: likeDetails) => PostLike.getViewLikeDetails(d));
};
