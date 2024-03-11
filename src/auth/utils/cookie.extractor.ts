export const cookieExtractor = function (req): Promise<string> {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies.refreshToken;
	}
	return token;
};
