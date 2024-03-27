import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DeviceIdFromReq = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	try {
		const deviceId = request.user.deviceId;
		return deviceId;
	} catch (e) {
		return false;
	}
});
