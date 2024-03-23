import { Length } from 'class-validator';
import { Transform } from 'class-transformer';
import validator from 'validator';

export class commentDto {
	id: string;
	content: string;
	commentatorInfo: {
		userId: string;
		userLogin: string;
	};
	createdAt: string;
	likesInfo: {
		likesCount: number;
		dislikesCount: number;
		myStatus: string;
	};
}

export class contentInputDto {
	@Transform(({ value }) => validator.trim(value))
	@Length(20, 300)
	content: string;
}
