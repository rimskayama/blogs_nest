import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../../constants';
import { RefreshTokenValidationCommand } from '../../use-cases/validations/validate-refresh-token.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { Request } from 'express';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh') {
	constructor(private commandBus: CommandBus) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					const token = req.cookies?.refreshToken;
					if (!token) return false;

					return token;
				},
			]),
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
