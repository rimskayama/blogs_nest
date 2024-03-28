import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../constants';
import { ObjectId } from 'mongodb';

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
		const accessPayload = { sub: new ObjectId(command.userId) };
		const refreshPayload = { sub: new ObjectId(command.userId), deviceId: command.deviceId };
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
