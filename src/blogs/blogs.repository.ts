import { BlogDto, BlogInputDto } from "./blogs.types";
import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Blog, BlogDocument } from "./blogs.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';

@Injectable()
export class BlogsRepository {
    constructor (
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

    async save(blog: BlogDocument) {
        blog.save()
    }

    async createBlog(
        blog : Blog): Promise<BlogDto> {
        const newBlog = new this.blogModel(blog);
        await this.save(newBlog);
        return Blog.getViewBlog(newBlog);
    }

    async updateBlog(
        _id: ObjectId, inputModel: BlogInputDto):
        Promise<boolean> {

        await this.blogModel.findByIdAndUpdate({_id:_id}, 
            {
                    name: inputModel.name,
                    description: inputModel.description,
                    websiteUrl: inputModel.websiteUrl,
            }
        )

        const blog: Blog | null = await this.blogModel.findById({_id:_id})
        if (blog) {
            return true
        } else
            return false
     }
     
    async deleteBlog(_id: ObjectId):
        Promise<BlogDocument | boolean> {
        const blog = await this.blogModel.findOne({_id}, {projection: {_id: 0}});

        if (blog) {
            return this.blogModel.deleteOne({_id}).lean()
        }
        return null
    }

    async deleteAll() {
        return this.blogModel.deleteMany({});
    }

}