import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { CommentViewDto } from './comments.types';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class commentanorInfo {
	@Prop({ required: true })
	userId: string;
	@Prop({ required: true })
	userLogin: string;
}

@Schema()
export class likesInfo {
	@Prop({ required: true, default: 0 })
	likesCount: number;
	@Prop({ required: true, default: 0 })
	dislikesCount: number;
	@Prop({ required: true, default: 'None' })
	myStatus: string;
}

@Schema()
export class Comment {
	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
	})
	_id: ObjectId;
	@Prop({ required: true })
	postId: string;
	@Prop({ required: true })
	content: string;
	@Prop({ required: true })
	commentatorInfo: commentanorInfo;
	@Prop({ required: true })
	createdAt: string;
	@Prop({ required: true })
	likesInfo: likesInfo;

	static getViewComment(commentFromDb: Comment): CommentViewDto {
		return {
			id: commentFromDb._id.toString(),
			content: commentFromDb.content,
			commentatorInfo: {
				userId: commentFromDb.commentatorInfo.userId,
				userLogin: commentFromDb.commentatorInfo.userLogin,
			},
			createdAt: commentFromDb.createdAt,
			likesInfo: {
				likesCount: commentFromDb.likesInfo.likesCount,
				dislikesCount: commentFromDb.likesInfo.dislikesCount,
				myStatus: commentFromDb.likesInfo.myStatus,
			},
		};
	}
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
