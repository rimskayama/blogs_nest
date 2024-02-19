import mongoose, { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BlogDto } from './blogs.types';
import { ObjectId } from 'mongodb';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {

    @Prop({ 
        required: true,
        type: mongoose.Schema.Types.ObjectId 
    })
    _id: ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    websiteUrl: string;

    @Prop({ default: new Date().toISOString() })
    createdAt: string;

    @Prop({ default: false })
    isMembership: boolean;

    static getViewBlog(blogFromDb: Blog): BlogDto {
        return {
            id: blogFromDb._id.toString(),
            name: blogFromDb.name,
            description: blogFromDb.description,
            websiteUrl: blogFromDb.websiteUrl,
            isMembership: blogFromDb.isMembership,
            createdAt: blogFromDb.createdAt,
        }
    }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);