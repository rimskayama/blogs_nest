export const jwtConstants = {
	accessTokenSecret: process.env.JWT_ACCESS_SECRET,
	accessTokenExpirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME,
	refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
	refreshTokenExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
};

export const basicAuthConstants = {
	username: process.env.SA_LOGIN,
	password: process.env.SA_PASSWORD,
};
