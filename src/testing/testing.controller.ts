import { BlogsService } from "src/blogs/blogs.service";
import { PostsService } from "src/posts/posts.service";
import { UsersService } from "src/users/users.service";
import { 
    Controller, 
    Delete, 
    HttpCode, 
    Inject
 } from "@nestjs/common";


@Controller('testing')
export class TestingController {
    constructor(
        @Inject(BlogsService) protected blogsService: BlogsService,
        @Inject(PostsService) protected postsService: PostsService,
        @Inject(UsersService) protected usersService: UsersService) {
    }

    @Delete('all-data')
    @HttpCode(204)
    async deleteAll () {
        await this.blogsService.deleteAll();
        await this.postsService.deleteAll();
        await this.usersService.deleteAll();
    }
}