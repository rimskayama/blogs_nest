import { BlogDto } from "./blogs.types";
import { ObjectId, SortDirection } from "mongodb";
import { blogsMapping } from "../functions/mapping";
import { BlogsPaginationDto } from "./blogs.types";
import { Injectable } from "@nestjs/common";
import { Blog, BlogDocument } from "./blogs.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';

@Injectable()
export class BlogsQueryRepository {
    constructor (
        @InjectModel(Blog.name)
        private blogModel: Model<BlogDocument>) {}
    async findBlogs(
        page: number, limit: number, sortDirection: SortDirection,
        sortBy: string, searchNameTerm: string, skip: number) : Promise<BlogsPaginationDto>
    {

        let allBlogs = await this.blogModel.find(
            {name: {$regex: searchNameTerm, $options: 'i'}},
            )
            .skip(skip)
            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .lean()

        const total = await this.blogModel.countDocuments(
            { name: { $regex: searchNameTerm, $options: 'i' }})

        const pagesCount = Math.ceil(total / limit)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items: blogsMapping(allBlogs)
        }
    }
    
    async findBlogByBlogId(blogId: string): Promise<BlogDto | null> {
        const blog: Blog | null = await this.blogModel.findOne({_id: new ObjectId(blogId)},{});
        if (!blog) {
            return null
        }
        return Blog.getViewBlog(blog)
    }
}