import { Injectable } from '@nestjs/common';
import { PostLike, PostLikeDocument } from './like.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PostLikesRepository {
	constructor(
		@InjectModel(PostLike.name)
		private PostLikeModel: Model<PostLikeDocument>
	) {}

	async countLikes(postId: string) {
		const likesCount = await this.PostLikeModel.countDocuments({
			status: 'Like',
			postId: postId,
		});
		const dislikesCount = await this.PostLikeModel.countDocuments({
			status: 'Dislike',
			postId: postId,
		});

		return {
			likesCount: likesCount,
			dislikesCount: dislikesCount,
		};
	}

	async setLikeStatus(newStatus: PostLike) {
		const postId = newStatus.postId;
		const userId = newStatus.userId;
		await this.PostLikeModel.create(newStatus);
		const like = await this.PostLikeModel.findOne({ $and: [{ postId: postId }, { userId: userId }] });
		if (like) {
			return true;
		}
		return false;
	}

	async checkLikeInDB(postId: string, userId: string) {
		const like = await this.PostLikeModel.findOne({ $and: [{ postId: postId }, { userId: userId }] });
		if (like) {
			return like;
		}
		return false;
	}

	async updateLikeStatus(likeStatus: string, postId: string, userId: string) {
		return this.PostLikeModel.findOneAndUpdate(
			{ $and: [{ postId: postId }, { userId: userId }] },
			{
				$set: {
					status: likeStatus,
					addedAt: new Date().toISOString(),
				},
			}
		);
	}

	async removeLike(postId: string, userId: string) {
		await this.PostLikeModel.deleteOne({ $and: [{ postId: postId }, { userId: userId }] });
		const like = await this.PostLikeModel.findOne({ $and: [{ postId: postId }, { userId: userId }] });
		if (!like) {
			return true;
		}
		return false;
	}
}
