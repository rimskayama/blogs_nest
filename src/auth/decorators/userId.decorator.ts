import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserFromReq = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	try {
		const userId = request.user.id;
		if (!userId) {
			return false;
		} else return userId;
	} catch (e) {
		return false;
	}
});
