import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserFromReq = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	try {
		const userId = request.user.id;
		const userLogin = request.user.login;
		if (!userId) {
			return false;
		} else
			return {
				id: userId,
				login: userLogin,
			};
	} catch (e) {
		return false;
	}
});
