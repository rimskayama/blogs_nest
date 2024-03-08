import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { basicAuthConstants } from '../constants';

@Injectable()
export class BasicAuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): Promise<boolean> | boolean | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		return this.validateRequest(request);
	}

	private async validateRequest(request: any): Promise<boolean> {
		const combinedString = `${basicAuthConstants.username}:${basicAuthConstants.password}`;
		const result = 'Basic ' + Buffer.from(combinedString).toString('base64');
		if (request.headers.authorization !== result) {
			return false;
		} else return true;
	}
}
