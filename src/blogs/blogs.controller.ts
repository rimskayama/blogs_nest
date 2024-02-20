import { getPagination } from "src/functions/pagination";
import { BlogsService } from "./blogs.service";
import { PostsService } from "src/posts/posts.service";
import { BlogsQueryRepository } from "./blogs.query.repository";
import { BlogInputDto } from "./blogs.types";
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { PostInputDto } from "src/posts/posts.types";
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

@Controller('blogs')
export class BlogsController {
    constructor(
        @Inject(BlogsService) protected blogsService: BlogsService,
        @Inject(PostsService) protected postsService: PostsService,
        @Inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @Inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
    ) {}

    @Get()
    @HttpCode(200)
    async getBlogs (@Query() query: QueryParameters) {
        const {page, limit, sortDirection, sortBy, searchNameTerm, skip} = getPagination(query);
        //authorization to get likeStatus to send to Query
        const allBlogs = await this.blogsQueryRepository.findBlogs(page, limit, sortDirection, sortBy, searchNameTerm, skip)
        return allBlogs
    }

    @Get(':id')
    @HttpCode(200)
    async getBlog(@Param('id') blogId: string) {
        //authorization to get likeStatus
        let blog = await this.blogsQueryRepository.findBlogByBlogId(blogId);
        if (blog) return blog
        else throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    @Get(':id/posts')
    @HttpCode(200)
    async getPostsOfBlog(
      @Param('id') blogId: string,
      @Query() query: QueryParameters) {
        let checkBlog = await this.blogsQueryRepository.findBlogByBlogId(blogId);
        const {page, limit, sortDirection, sortBy, skip} =  getPagination(query);

        //authorization to set likeStatus

        if (checkBlog) {
            let posts = await this.postsQueryRepository.findPostsByBlogId(
                blogId, page, limit, sortDirection, sortBy, skip);
            return posts
        } else throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
     }

    @Post()
    @HttpCode(201)
    async createBlog(@Body() inputModel: BlogInputDto) {
        const newBlog = await this.blogsService.createBlog(inputModel);
        return newBlog
    }

    @Post(':id/posts')
    @HttpCode(201)
    async createPostForSpecifiedBlog(
      @Body() inputModel: PostInputDto,
      @Param('id') blogId : string) {
        if (blogId) {
            inputModel.blogId = blogId;
        }
        const newPost = await this.postsService.createPost(inputModel);
        if (newPost) {
            return newPost
        } else throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    @Put(':id')
    @HttpCode(204)
    async updateBlog(
      @Body() inputModel: BlogInputDto,
      @Param('id') blogId: string
    ) {
        const updatedBlog = await this.blogsService.updateBlog(blogId, inputModel)
        if (updatedBlog) return updatedBlog
         else throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteBlog (
        @Param('id') blogId: string) {
        const result = await this.blogsService.deleteBlog(blogId);
        if (result) return 
        else throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
}