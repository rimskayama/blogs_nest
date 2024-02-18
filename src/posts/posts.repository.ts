import { PostDto, PostInputDto } from "./posts.types";
import { ObjectId } from "mongodb";
import { Post, PostDocument } from "./posts.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Injectable } from "@nestjs/common";

@Injectable()
export class PostsRepository {
    constructor (
    @InjectModel(Post.name) private postModel: Model<PostDocument>) {}
    
    async save(post: PostDocument) {
        post.save()
    }

    async createPost(
        post : Post): Promise<PostDto> {
        const newPost = new this.postModel(post);
        await this.save(newPost)
        return Post.getViewPost(newPost)
    }

    async updatePost(_id: ObjectId, inputModel: PostInputDto) {
        await this.postModel.findByIdAndUpdate({_id},
                {
                    title: inputModel.title,
                    shortDescription: inputModel.shortDescription,
                    content: inputModel.content,
                    blogId: inputModel.blogId,
                }
        )

        const post: PostDto | null = await this.postModel.findById({_id:_id});
        if (post) {
            return true
        } else
            return false
    }

    async deletePost(_id: ObjectId) {
        const post = await this.postModel.findOne({_id},{projection: {_id: 0}});
        if (post) {
            return this.postModel.deleteOne({_id});
        }
        return null
    }

    async deleteAll() {
        return this.postModel.deleteMany({}, {});
    }

}