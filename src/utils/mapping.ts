import { Blog } from 'src/blogs/blogs.entity';
import { PostLike } from 'src/likes/likes.entity';
import { Post, likeDetails } from 'src/posts/posts.entity';
import { User } from 'src/users/users.entity';

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
