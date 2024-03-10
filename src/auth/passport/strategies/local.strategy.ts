import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../auth.service';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'loginOrEmail',
		});
	}
	async validate(loginOrEmail: string, password: string): Promise<UnauthorizedException | User> {
		const user = await this.authService.validateUser(loginOrEmail, password);
		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
