import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from '../../constants';
import { CommandBus } from '@nestjs/cqrs';
import { AccessTokenValidationCommand } from '../../use-cases/validations/validate-access-token.use-case';

@Injectable()
export class JwtBearerStrategy extends PassportStrategy(Strategy, 'bearer') {
	constructor(private commandBus: CommandBus) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: jwtConstants.accessTokenSecret,
			ignoreExpiration: false,
		});
	}

	async validate(payload: any) {
		const result = await this.commandBus.execute(new AccessTokenValidationCommand(payload));
		if (!result) return false;
		else
			return {
				id: payload.sub,
			};
	}
}
