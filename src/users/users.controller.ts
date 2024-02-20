import { UsersService } from "./users.service";
import { UsersQueryRepository } from "./users.query.repository";
import { getPagination } from "../functions/pagination";
import { ObjectId } from "mongodb";
import { UserInputDto, QueryParameters } from "./users.types";
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
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(@Inject(UsersService) protected usersService: UsersService,
                @Inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository) {
    }

    @Get()
    @HttpCode(200)
    async getUsers (@Query() query: QueryParameters) {
    const {page, limit, sortDirection, sortByUsers, 
        searchLoginTerm, searchEmailTerm, skip} = getPagination(query);
    const allUsers = await this.usersQueryRepository.findUsers(
        page, limit, sortDirection, sortByUsers, skip, searchLoginTerm, searchEmailTerm)
        return allUsers
    }

    @Get(':id')
    @HttpCode(200)
    async getUser (@Param('id') userId: string) {
        let user = await this.usersQueryRepository.findUserById(new ObjectId(userId))
        if (user) return user
        else throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }

    @Post()
    @HttpCode(201)
    async createUser (@Body() inputModel: UserInputDto) {
        const newUser = await this.usersService.createUser(inputModel)
        return newUser
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteUser (@Param('id') userId: string) {
        const result = await this.usersService.deleteUser(userId);
        if (result) return 
        else throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
}