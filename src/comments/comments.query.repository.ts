import { ObjectId, SortDirection } from 'mongodb';
import { commentsMapping } from '../utils/mapping';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CommentLike, CommentLikeDocument } from '../likes/like.entity';

@Injectable()
export class CommentsQueryRepository {
	constructor(
		@InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
		@InjectModel(CommentLike.name) private commentLikeModel: Model<CommentLikeDocument>
	) {}
	async findCommentsByPostId(
		postId: string,
		page: number,
		limit: number,
		sortDirection: SortDirection,
		sortBy: string,
		skip: number,
		userId: string | false
	) {
		const allComments = await this.commentModel
			.find({ postId: postId })
			.skip(skip)
			.limit(limit)
			.sort({ [sortBy]: sortDirection })
			.lean();

		const idList = [];
		for (let i = 0; i < allComments.length; i++) {
			idList.push(allComments[i]._id);
		}

		const statusList: string[] = [];
		for (let i = 0; i < allComments.length; i++) {
			let likeStatus = 'None';
			if (userId) {
				const likeInDB = await this.commentLikeModel.findOne({
					$and: [{ commentId: allComments[i]._id }, { userId: userId }],
				});
				if (likeInDB) {
					likeStatus = likeInDB.status.toString();
				}
			}
			statusList.push(likeStatus);
		}

		for (let i = 0; i < allComments.length; i++) {
			allComments.map((obj, number) => (obj.likesInfo.myStatus = statusList[number]));
		}

		const total = await this.commentModel.countDocuments({ postId: postId });

		const pagesCount = Math.ceil(total / limit);

		return {
			pagesCount: pagesCount,
			page: page,
			pageSize: limit,
			totalCount: total,
			items: commentsMapping(allComments),
		};
	}

	async updateCommentLikes(commentId: string, likesCount: number, dislikesCount: number) {
		await this.commentModel.updateOne(
			{ _id: new ObjectId(commentId) },
			{
				$set: {
					'likesInfo.likesCount': likesCount,
					'likesInfo.dislikesCount': dislikesCount,
				},
			}
		);
	}
}
