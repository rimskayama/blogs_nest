import mongoose, { HydratedDocument } from 'mongoose'
import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class accountData {

    @Prop({ require: true })
    login: string;

    @Prop({ require: true })
    email: string

    @Prop({ require: true })
    passwordHash: string;

    @Prop({ require: true })
    passwordSalt: string;

    @Prop({ require: true })
    createdAt: Date;
}

//export const accountDataSchema = SchemaFactory.createForClass(accountData);

@Schema()
export class emailConfirmation {
    @Prop({ require: true })
    confirmationCode: string;

    @Prop({ require: true })
    expirationDate: Date

    @Prop({ require: true })
    isConfirmed: boolean;

}

//export const emailConfirmationSchema = SchemaFactory.createForClass(emailConfirmation);

@Schema()
export class passwordConfirmation {
    @Prop({ require: true })
    recoveryCode: string;

    @Prop({ require: true })
    expirationDate: Date

}

//export const passwordConfirmationSchema = SchemaFactory.createForClass(passwordConfirmation);

@Schema()
export class User {

    @Prop({ 
        required: true,
        type: mongoose.Schema.Types.ObjectId 
    })
    _id: ObjectId;

    @Prop({ required: true })
    accountData: accountData;
    
    @Prop({ required: true })
    emailConfirmation: emailConfirmation;

    @Prop({ required: true })
    passwordConfirmation: passwordConfirmation;

    static getViewUser(userFromDb: User) {
        return {
            id: userFromDb._id.toString(),
            login: userFromDb.accountData.login,
            email: userFromDb.accountData.email,
            createdAt: userFromDb.accountData.createdAt,
        }
    }

}

export const UserSchema = SchemaFactory.createForClass(User);
