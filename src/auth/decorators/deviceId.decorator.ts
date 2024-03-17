import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DeviceIdFromReq = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	try {
		const userId = request.user.deviceId;
		return userId;
	} catch (e) {
		return false;
	}
});
