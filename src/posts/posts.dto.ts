import { Length } from 'class-validator';
import { Transform } from 'class-transformer';
import validator from 'validator';

export class PostInputDto {
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 30)
	title: string;
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 100)
	shortDescription: string;
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 1000)
	content: string;
}

export class SpecifiedPostInputDto {
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 30)
	title: string;
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 100)
	shortDescription: string;
	@Transform(({ value }) => validator.trim(value))
	@Length(1, 1000)
	content: string;
}
