import { StatusCode } from './exception.constants';

export type exceptionObjectType = {
	message: string;
	field: string;
};

export type exceptionResponseType = {
	errorsMessages: exceptionObjectType[];
};

export type exceptionResultType = {
	code: StatusCode;
	field?: string;
	message?: string;
};
