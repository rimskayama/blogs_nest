import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { StatusCode } from './exception.constants';

export const exceptionHandler = (code: StatusCode, message?: string, field?: string) => {
	const exceptionObject = {
		message: [
			{
				message: message,
				field: field,
			},
		],
	};

	switch (code) {
		case StatusCode.BadRequest: {
			throw new BadRequestException(exceptionObject);
		}
		case StatusCode.Forbidden: {
			throw new ForbiddenException(exceptionObject);
		}
		case StatusCode.NotFound: {
			throw new NotFoundException(exceptionObject);
		}
	}
};
