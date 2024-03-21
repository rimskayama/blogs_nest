import { IsString, Length, Matches, Validate } from 'class-validator';
import { loginDoesNotExistRule } from '../auth/authentification';
import { loginPattern } from '../users/users.types';
import { Type } from 'class-transformer';

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
	@IsString()
	@Length(20, 300)
	content: string;
}

export class commentatorInfo {
	@IsString()
	@Length(3, 10)
	@Matches(loginPattern, {
		message: 'Login must be in correct format',
	})
	@Validate(loginDoesNotExistRule)
	userId: string;
	userLogin: string;
}

export class commentInputDto {
	@IsString()
	@Length(20, 300)
	content: string;
	@Type(() => commentatorInfo)
	commentatorInfo: {
		userId: string;
		userLogin: string;
	};
}
