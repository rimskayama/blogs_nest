import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserFromReq = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	try {
		const userId = request.user.id;
		return userId;
	} catch (e) {
		return false;
	}
});
