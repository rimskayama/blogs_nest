import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/domain/user.entity';
import { CommandBus } from '@nestjs/cqrs';
import { UserValidationCommand } from '../../use-cases/validations/validate-user.use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private commandBus: CommandBus) {
		super({
			usernameField: 'loginOrEmail',
		});
	}
	async validate(loginOrEmail: string, password: string): Promise<UnauthorizedException | User> {
		const user = await this.commandBus.execute(new UserValidationCommand(loginOrEmail, password));
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
