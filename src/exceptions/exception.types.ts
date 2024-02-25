export type exceptionObjectType = {
	message: string;
	field: string;
};

export type exceptionResponseType = {
	errorsMessages: exceptionObjectType[];
};
