import { ArrayMinSize, IsArray, IsBoolean, IsString, IsUUID, Length } from 'class-validator';

export class QuestionInputDto {
	@IsString()
	@Length(10, 500)
	body: string;
	@IsArray()
	@ArrayMinSize(1)
	@IsString({ each: true })
	correctAnswers: string[];
}

export class PublishInputModel {
	@IsBoolean()
	published: boolean;
}

export class AnswerInputModel {
	@IsString()
	answer: string;
}

export class GameDto {
	@IsUUID()
	id: string;
}
