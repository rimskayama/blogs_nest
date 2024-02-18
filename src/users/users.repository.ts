import { UserDto } from "./users.types";
import { User } from "./users.entity";
import {ObjectId} from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import { UserDocument } from "./users.entity";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UsersRepository {
    constructor (
        @InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async save(user: UserDocument) {
        user.save()
    }

    async createUser (user : User): Promise<UserDto> {
        const newUser = new this.userModel(user);
        await this.save(newUser)
        return User.getViewUser(newUser)
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {

        const user: User | null = await this.userModel.findOne(
            {$or: [{"accountData.login": loginOrEmail}, {"accountData.email": loginOrEmail}]});

        if (!user) {
            return null
        }
        return user

    }

    async findByConfirmationCode(code: string): Promise<User | null> {
        const user: User | null = await this.userModel.findOne(
            {"emailConfirmation.confirmationCode": code})
        return user || null
    }

    async findByRecoveryCode(recoveryCode: string): Promise<User | null> {
        const user: User | null = await this.userModel.findOne(
            {"passwordConfirmation.recoveryCode": recoveryCode})
        return user || null
    }

    async updateConfirmation(_id: ObjectId) {
        await this.userModel.findByIdAndUpdate({_id}, {
            $set:
                {
                    "emailConfirmation.isConfirmed": true
                }
        })
        return true
    }

    async updateConfirmationCode(_id: ObjectId) {
        await this.userModel.findByIdAndUpdate({_id}, {
            $set:
                {
                    "emailConfirmation.confirmationCode": uuidv4(),
                    "emailConfirmation.expirationDate": add(new Date(),{
                        hours: 1,
                        minutes: 3
                    })
                }
        })
        return this.userModel.findById({_id});
    }

    async updatePasswordRecoveryCode(_id: ObjectId) {
        await this.userModel.findByIdAndUpdate({_id}, {
            $set:
                {
                    "passwordConfirmation.recoveryCode": uuidv4(),
                    "passwordConfirmation.expirationDate": add(new Date(),{
                        hours: 1,
                        minutes: 3
                    })
                }
        })
        return this.userModel.findById({_id});
    }

    async updatePassword(_id: ObjectId, passwordHash: string, passwordSalt: string) {
        await this.userModel.updateOne({_id}, {
            $set:
                {
                    "accountData.passwordHash": passwordHash,
                    "accountData.passwordSalt": passwordSalt
                }
        })
        return true
    }

    async deleteUser(_id: ObjectId) {
        const user = await this.userModel.findById({_id}, {projection: {_id: 0}});
        if (user) {
            return this.userModel.deleteOne({_id});
        }
        return null
    }

    async deleteAll() {
        return this.userModel.deleteMany({}, {});
    }

}