import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserAuthGuard extends AuthGuard('user') {
	canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}
	handleRequest(err, user) {
		if (err || !user) {
			return;
		}
		return user;
	}
}
