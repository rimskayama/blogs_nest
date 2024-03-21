import { ObjectId } from 'mongodb';
import { Comment, CommentDocument } from './comment.entity';
import { commentDto } from './comments.types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentLike, CommentLikeDocument } from '../likes/like.entity';

@Injectable()
export class CommentsRepository {
	constructor(
		@InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
		@InjectModel(CommentLike.name) private commentLikeModel: Model<CommentLikeDocument>
	) {}

	async save(comment: CommentDocument) {
		comment.save();
	}

	async findCommentById(_id: ObjectId, userId: string | false): Promise<commentDto | null> {
		const comment: Comment | null = await this.commentModel.findOne({ _id });
		if (!comment) {
			return null;
		}

		comment.likesInfo.myStatus = 'None';
		if (userId) {
			const likeInDB = await this.commentLikeModel.findOne({ $and: [{ commentId: comment._id }, { userId: userId }] });
			if (likeInDB) {
				comment.likesInfo.myStatus = likeInDB.status.toString();
			}
		}
		return Comment.getViewComment(comment);
	}
	async createComment(comment: Comment): Promise<commentDto> {
		const newComment = new this.commentModel(comment);
		await this.save(newComment);
		return Comment.getViewComment(newComment);
	}

	async updateComment(_id: ObjectId, content: string) {
		return await this.commentModel.findByIdAndUpdate(
			{ _id: _id },
			{
				content: content,
			}
		);
	}

	async deleteComment(_id: ObjectId) {
		await this.commentModel.deleteOne({ _id });
		const comment = await this.commentModel.findById({ _id: _id });
		if (!comment) {
			return true;
		}
		return false;
	}

	async deleteAll() {
		return this.commentModel.deleteMany({});
	}
}
