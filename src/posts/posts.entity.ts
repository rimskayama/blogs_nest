import mongoose, { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PostDto } from './posts.types';
import { likeDetailsMapping } from 'src/functions/mapping';
import { ObjectId } from 'mongodb';

export type PostDocument = HydratedDocument<Post>

@Schema()
export class likeDetails {
    @Prop({})
    addedAt: string;

    @Prop({})
    userId: string;

    @Prop({})
    login: string;
}


@Schema()
export class extendedLikesInfo {
    @Prop({ default: 0 })
    likesCount: number;

    @Prop({ default: 0 })
    dislikesCount: number;

    @Prop({ default: 'None' })
    myStatus: string;

    @Prop({ default: []})
    newestLikes: likeDetails[]
}

@Schema()
export class Post {

    @Prop({ 
        required: true,
        type: mongoose.Schema.Types.ObjectId 
    })
    _id: ObjectId;

    @Prop({ required: true })
    title: string;
    
    @Prop({ required: true })
    shortDescription: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    blogId:  string;

    @Prop({ required: true })
    blogName: string;

    @Prop({ default: new Date().toISOString() })
    createdAt: string;

    @Prop({ default: [] })
    extendedLikesInfo: extendedLikesInfo

    static getViewPost(postFromDb: Post): PostDto {
        return {
            id: postFromDb._id.toString(),
            title: postFromDb.title,
            shortDescription: postFromDb.shortDescription,
            content: postFromDb.content,
            blogId: postFromDb.blogId,
            blogName: postFromDb.blogName,
            createdAt: postFromDb.createdAt,
            extendedLikesInfo: {
                likesCount: postFromDb.extendedLikesInfo.likesCount,
                dislikesCount: postFromDb.extendedLikesInfo.dislikesCount,
                myStatus: postFromDb.extendedLikesInfo.myStatus,
                newestLikes: likeDetailsMapping(postFromDb.extendedLikesInfo.newestLikes)
            }

        }
    }
}

export const PostSchema = SchemaFactory.createForClass(Post);