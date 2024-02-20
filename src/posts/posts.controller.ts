import { PostsService } from "./posts.service";
import { PostsQueryRepository } from "./posts.query.repository";
import { getPagination } from "../functions/pagination";
import { PostInputDto } from "./posts.types";
import { QueryParameters } from "src/users/users.types";
import { 
    Body,
  Controller,  
  Delete,  
  Get, 
  HttpCode, 
  HttpException, 
  HttpStatus, 
  Inject, 
  Param, 
  Post, 
  Put, 
  Query
} from '@nestjs/common';

@Controller('posts')
export class PostsController {
    constructor(
        @Inject(PostsService) protected postsService: PostsService,
        @Inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository
        ) {}
    
    @Get()
    @HttpCode(200)
    async getPosts (@Query() query: QueryParameters) {
    const {page, limit, sortDirection, sortBy, skip} = getPagination(query);
    //authorization to get likeStatus
    const allPosts = await this.postsQueryRepository.findPosts(
        page, limit, sortDirection, sortBy, skip)
        return allPosts
    }
    
    @Get(':id')
    @HttpCode(200)
    async getPost (@Param('id') blogId: string) {
        //authorization to get likeStatus
        let post = await this.postsQueryRepository.findPostById(blogId);
        if (post) return post
        else throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    @Post()
    @HttpCode(201)
    async createPost (@Body() inputModel: PostInputDto) {
        const newPost = await this.postsService.createPost(inputModel);
        if (newPost) return newPost
        else throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }

    // getCommentsOfPost 
    // createCommentByPostId 

    @Put(':id')
    @HttpCode(204)
    async updatePost (
        @Body() inputModel: PostInputDto,
        @Param('id') id: string 
    ) {
        const isUpdated = await this.postsService.updatePost(id, inputModel)
        if (isUpdated) return
        else throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }

    // updateLikeStatus 

    @Delete(':id')
    @HttpCode(204)
    async deletePost (@Param('id') postId: string) {
        const result = await this.postsService.deletePost(postId);
        if (result) return 
        else throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
}