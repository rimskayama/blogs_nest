import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { likeDetails } from 'src/posts/post.entity';
import { likeDetailsDto } from './likes.types';

export type PostLikeDocument = HydratedDocument<PostLike>;

@Schema()
export class PostLike {
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
