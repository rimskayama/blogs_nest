import { PostDto, postsPaginationDto } from './posts.types';
import { ObjectId, SortDirection } from 'mongodb';
import { likeDetails } from './post.entity';
import { Post, PostDocument } from './post.entity';
import { PostLike, PostLikeDocument } from '../likes/like.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../likes/likes.types';

@Injectable()
export class PostsQueryRepository {
	constructor(
		@InjectModel(Post.name)
		private PostModel: Model<PostDocument>,
		@InjectModel(PostLike.name)
		private PostLikeModel: Model<PostLikeDocument>
	) {}

	async findPosts(
		page: number,
		limit: number,
		sortDirection: SortDirection,
		sortBy: string,
		skip: number,
		userId: string | false
	): Promise<postsPaginationDto> {
		const allPosts = await this.PostModel.find({})
			.skip(skip)
			.limit(limit)
			.sort({ [sortBy]: sortDirection })
			.lean();

		const total = await this.PostModel.countDocuments();

		const pagesCount = Math.ceil(total / limit);

		const items = await Promise.all(
			allPosts.map(async (post) => {
				let likeStatus = 'None';
				if (userId) {
					const likeInDB = await this.PostLikeModel.findOne({ postId: post._id.toString(), userId: userId });
					if (likeInDB) {
						likeStatus = likeInDB.status;
					}
				}

				const newestLikes: likeDetails[] = await this.PostLikeModel.find({
					postId: post._id.toString(),
					status: 'Like',
				})
					.sort({ addedAt: -1 })
					.limit(3)
					.lean();

				return Post.getViewPost({
					...post,
					extendedLikesInfo: {
						...post.extendedLikesInfo,
						newestLikes,
						myStatus: likeStatus,
					},
				});
			})
		);
		return {
			pagesCount: pagesCount,
			page: page,
			pageSize: limit,
			totalCount: total,
			items,
		};
	}

	async findPostById(id: string, userId: string | false): Promise<PostDto | null> {
		const post: Post | null = await this.PostModel.findById({ _id: new ObjectId(id) }).lean();
		if (!post) {
			return null;
		}

		let myStatus = 'None';
		if (userId) {
			const likeInDB = await this.PostLikeModel.findOne({ postId: post._id.toString(), userId: userId });
			if (likeInDB) {
				myStatus = likeInDB.status;
			}
		}

		const newestLikes: likeDetails[] = await this.PostLikeModel.find({
			postId: post._id.toString(),
			status: LikeStatus.Like,
		})
			.sort({ addedAt: -1 })
			.limit(3)
			.lean();

		return Post.getViewPost({
			...post,
			extendedLikesInfo: {
				...post.extendedLikesInfo,
				newestLikes,
				myStatus,
			},
		});
	}

	async findPostsByBlogId(
		blogId: string,
		page: number,
		limit: number,
		sortDirection: SortDirection,
		sortBy: string,
		skip: number,
		userId: string | false
	) {
		const postsByBlogId = await this.PostModel.find({ blogId: blogId })
			.skip(skip)
			.limit(limit)
			.sort({ [sortBy]: sortDirection })
			.lean();

		const total = await this.PostModel.countDocuments({ blogId: blogId });

		const pagesCount = Math.ceil(total / limit);

		const items = await Promise.all(
			postsByBlogId.map(async (post) => {
				let likeStatus = 'None';
				if (userId) {
					const likeInDB = await this.PostLikeModel.findOne({ postId: post._id.toString(), userId: userId });
					if (likeInDB) {
						likeStatus = likeInDB.status;
					}
				}

				const newestLikes: likeDetails[] = await this.PostLikeModel.find({
					postId: post._id.toString(),
					status: 'Like',
				})
					.sort({ addedAt: -1 })
					.limit(3)
					.lean();

				return Post.getViewPost({
					...post,
					extendedLikesInfo: {
						...post.extendedLikesInfo,
						newestLikes,
						myStatus: likeStatus,
					},
				});
			})
		);

		return {
			pagesCount: pagesCount,
			page: page,
			pageSize: limit,
			totalCount: total,
			items,
		};
	}

	async updatePostLikes(postId: string, likesCount: number, dislikesCount: number) {
		await this.PostModel.findByIdAndUpdate(
			{ _id: new ObjectId(postId) },
			{
				$set: {
					'extendedLikesInfo.likesCount': likesCount,
					'extendedLikesInfo.dislikesCount': dislikesCount,
				},
			}
		);
	}
}
