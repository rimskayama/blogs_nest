import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from '../../constants';
import { cookieExtractor } from '../../utils/cookie.extractor';
import { RefreshTokenValidationCommand } from '../../use-cases/validations/validate-refresh-token.use-case';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh') {
	constructor(private commandBus: CommandBus) {
		super({
			jwtFromRequest: cookieExtractor,
			ignoreExpiration: false,
			secretOrKey: jwtConstants.refreshTokenSecret,
		});
	}

	async validate(payload: any) {
		const result = await this.commandBus.execute(new RefreshTokenValidationCommand(payload));
		if (!result) return false;
		else
			return {
				id: payload.sub,
				deviceId: payload.deviceId,
			};
	}
}
