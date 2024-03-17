import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DeviceDetais = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	try {
		const deviceName = request.headers['user-agent'] || 'Device name';
		const ip = request.socket.remoteAddress || 'IP address';
		const expDate = request.headers.expires || 'expDate';
		return {
			deviceName,
			ip,
			expDate,
		};
	} catch (e) {
		return false;
	}
});
