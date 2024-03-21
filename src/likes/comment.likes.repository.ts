import { Injectable } from '@nestjs/common';
import { CommentLike, CommentLikeDocument } from './like.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommentLikesRepository {
	constructor(@InjectModel(CommentLike.name) private commentLikeModel: Model<CommentLikeDocument>) {}
	async countLikes(commentId: string) {
		const likesCount = await this.commentLikeModel.countDocuments({
			status: 'Like',
			commentId: commentId,
		});
		const dislikesCount = await this.commentLikeModel.countDocuments({
			status: 'Dislike',
			commentId: commentId,
		});
		return {
			likesCount: likesCount,
			dislikesCount: dislikesCount,
		};
	}

	async setLikeStatus(newStatus: CommentLike) {
		const commentId = newStatus.commentId;
		const userId = newStatus.userId;
		await this.commentLikeModel.create(newStatus);
		const like = await this.commentLikeModel.findOne({ $and: [{ commentId: commentId }, { userId: userId }] });
		if (like) {
			return true;
		}
		return false;
	}

	async checkLikeInDB(commentId: string, userId: string) {
		const like = await this.commentLikeModel.findOne({ $and: [{ commentId: commentId }, { userId: userId }] });
		if (like) {
			return like;
		}
		return false;
	}

	async updateLikeStatus(likeStatus: string, commentId: string, userId: string) {
		return this.commentLikeModel.findOneAndUpdate(
			{ $and: [{ commentId: commentId }, { userId: userId }] },
			{
				$set: {
					status: likeStatus,
					addedAt: new Date().toISOString(),
				},
			}
		);
	}

	async removeLike(commentId: string, userId: string) {
		await this.commentLikeModel.deleteOne({ $and: [{ commentId: commentId }, { userId: userId }] });
		const like = await this.commentLikeModel.findOne({ $and: [{ commentId: commentId }, { userId: userId }] });
		if (!like) {
			return true;
		}
		return false;
	}

	// async getCommentLikes(commentId: string) {
	//     const commentLikes = await LikeModel.find({commentId: commentId}).lean()
	//     return {commentLikes}
	// }
}
