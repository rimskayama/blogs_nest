import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from "mongodb";
import { add } from "date-fns";
import { UsersRepository } from "./users.repository";
import { Inject, Injectable } from "@nestjs/common";
import { UserDto, UserInputDto } from './users.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
     constructor(@Inject(UsersRepository) protected usersRepository: UsersRepository) {
    }

    async createUser(inputModel: UserInputDto): Promise<UserDto> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(inputModel.password, passwordSalt)

        const newUser = {
        _id: new ObjectId(), 
        accountData: {
            login: inputModel.login, 
            email: inputModel.email, 
            passwordHash: passwordHash, 
            passwordSalt: passwordSalt, 
            createdAt: new Date()
        },
        emailConfirmation: {
            confirmationCode: uuidv4(), 
            expirationDate: new Date(), 
            isConfirmed: true
        },
        passwordConfirmation: {
            recoveryCode: uuidv4(), 
            expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                })
        }}

        return this.usersRepository.createUser(newUser)
    }

    async checkCredentials(loginOrEmail: string, password: string) {

        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false // login or password
        if (user) {
            const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
            if (user.accountData.passwordHash !== passwordHash) {
                return false // password
            } else return user
        } return false
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

    async deleteUser(id: string) {
        return await this.usersRepository.deleteUser(new ObjectId(id));
    }

    async deleteAll() {
        return await this.usersRepository.deleteAll();
    }
}