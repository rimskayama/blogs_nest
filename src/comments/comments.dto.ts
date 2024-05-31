import { Length } from 'class-validator';
import { Transform } from 'class-transformer';
import validator from 'validator';

export class contentInputDto {
	@Transform(({ value }) => validator.trim(value))
	@Length(20, 300)
	content: string;
}
