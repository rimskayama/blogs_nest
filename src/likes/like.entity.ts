import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { likeDetails } from 'src/posts/post.entity';
import { likeDetailsDto } from './likes.types';
import { ObjectId } from 'mongodb';

export type PostLikeDocument = HydratedDocument<PostLike>;

@Schema()
export class PostLike {
	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
	})
	_id: ObjectId;

	@Prop({ required: true })
	postId: string;

	@Prop({ required: true })
	status: string;

	@Prop({ required: true })
	userId: string;

	@Prop({ required: true })
	userLogin: string;

	@Prop({ required: true })
	addedAt: string;

	static getViewLikeDetails(likeDetails: likeDetails): likeDetailsDto {
		return {
			addedAt: likeDetails.addedAt,
			userId: likeDetails.userId,
			login: likeDetails.login,
		};
	}
}
export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

export type CommentLikeDocument = HydratedDocument<CommentLike>;

@Schema()
export class CommentLike {
	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
	})
	_id: ObjectId;

	@Prop({ required: true })
	commentId: string;

	@Prop({ required: true })
	status: string;

	@Prop({ required: true })
	userId: string;

	@Prop({ required: true })
	userLogin: string;

	@Prop({ required: true })
	addedAt: string;
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);
