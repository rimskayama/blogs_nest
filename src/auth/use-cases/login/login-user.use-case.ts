import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../constants';

export class LoginUserCommand {
	constructor(
		public userId: string,
		public deviceId: string
	) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
	constructor(private readonly jwtService: JwtService) {}

	async execute(command: LoginUserCommand): Promise<object> {
		const accessPayload = { sub: command.userId };
		const refreshPayload = { sub: command.userId, deviceId: command.deviceId };
		const accessToken = this.jwtService.sign(accessPayload, {
			secret: jwtConstants.accessTokenSecret,
			expiresIn: jwtConstants.accessTokenExpirationTime,
		});
		const refreshToken = this.jwtService.sign(refreshPayload, {
			secret: jwtConstants.refreshTokenSecret,
			expiresIn: jwtConstants.refreshTokenExpirationTime,
		});

		return {
			accessToken,
			refreshToken,
		};
	}
}
