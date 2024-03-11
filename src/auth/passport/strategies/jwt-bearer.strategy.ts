import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from '../../constants';

@Injectable()
export class JwtBearerStrategy extends PassportStrategy(Strategy, 'bearer') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: jwtConstants.accessTokenSecret,
			passReqToCallback: true,
		});
	}

	async validate(payload: any) {
		return {
			id: payload.sub,
		};
	}
}
