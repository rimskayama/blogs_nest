import { Transform } from 'class-transformer';
import { IsUrl, Length } from 'class-validator';
import validator from 'validator';

export class BlogInputDto {
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 15)
	name: string;
	@Length(1, 500)
	description: string;
	@IsUrl()
	websiteUrl: string;
}
