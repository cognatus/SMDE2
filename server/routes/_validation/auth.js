const auth = require('../_auth');
const settings = require('../settings');

module.exports = (req, res, next) => {
	let token = req.headers.authorization;
	if ( !token ) {
		return res.status(403).send({ success: false, message: settings.ERROR_MESSAGES.NO_TOKEN_PROVIDED, errors: null, result: null });
	}
	auth.getAccessToken(token, (err, accessToken) => {
		if ( err ) {
			return res.status(401).send({ success: false, message: settings.HTTP_ERROR_MESSAGES.UNAUTHORIZED, errors: null, result: null });
		}
		req.decoded = accessToken;
		next();
	});
}

