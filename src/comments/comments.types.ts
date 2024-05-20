import { Length } from 'class-validator';
import { Transform } from 'class-transformer';
import validator from 'validator';

export class CommentViewDto {
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

export class CommentDto {
	id: string;
	postId: string;
	content: string;
	userId: string;
	userLogin: string;
	createdAt: Date;
	likesCount?: number;
	dislikesCount?: number;
	myStatus?: string;
}

export class contentInputDto {
	@Transform(({ value }) => validator.trim(value))
	@Length(20, 300)
	content: string;
}

export class CommentType {
	id: string;
	postId: string;
	content: string;
	createdAt: Date;
	userId: string;
}
