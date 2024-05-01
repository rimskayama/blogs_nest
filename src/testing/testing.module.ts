import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingController } from './testing.controller';

@Module({
	imports: [ConfigModule.forRoot()],
	controllers: [TestingController],
	providers: [],
})
export class TestingModule {}
