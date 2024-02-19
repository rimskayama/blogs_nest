import { ObjectId, SortDirection } from "mongodb";
import { UsersPaginationDto } from "./users.types";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./users.entity";
import { Model } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { UserDto } from "./users.types";
import { usersMapping } from "../functions/mapping";

@Injectable()
export class UsersQueryRepository {
    constructor (
        @InjectModel(User.name)
        private userModel: Model<UserDocument>) {}

    async findUsers(
        page: number, limit: number, sortDirection: SortDirection,
        sortBy: string, skip: number, searchLoginTerm: string, searchEmailTerm: string):
        Promise<UsersPaginationDto>
    {

        let allUsers = await this.userModel.find(
            {$or:
                    [{"accountData.login": {$regex: searchLoginTerm, $options: 'i'}},
                     {"accountData.email": {$regex: searchEmailTerm, $options: 'i'}}]}
        )

            .limit(limit)
            .sort( {[sortBy]: sortDirection})
            .skip(skip)
            .lean()
            .exec()

        const total = await this.userModel.countDocuments(
            {$or:
                    [{"accountData.login": {$regex: searchLoginTerm, $options: 'i'}},
                        {"accountData.email": {$regex: searchEmailTerm, $options: 'i'}}]}
        ).exec()

        const pagesCount = Math.ceil(total / limit)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: limit,
            totalCount: total,
            items: usersMapping(allUsers)
        }
    }

    async findUserById (
        _id: ObjectId): Promise<UserDto | null> {
        const user: User | null = await this.userModel.findOne({_id});
        if (!user) {
            return null
        }
        return User.getViewUser(user)

    }
}