import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";
import { UsersQueryRepository } from "./users.query.repository";
import { User, UserSchema } from "./users.entity";

@Module({
    imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.MONGO_URL),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
      controllers: [UsersController],
      providers: [UsersService, UsersRepository, UsersQueryRepository]
  })
  export class UsersModule {}