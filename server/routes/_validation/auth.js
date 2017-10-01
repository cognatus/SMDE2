const jwt = require('jsonwebtoken');
const settings = require('../settings');

module.exports = (req, res, next) => {
	let token = req.headers.authorization;

	if ( token ) {
		// verifies secret and checks exp
		jwt.verify(token, settings.SECRET, function(err, decoded) {			
			if (err) {
				return res.status(401).send({ success: false, message: settings.HTTP_ERROR_MESSAGES.UNAUTHORIZED, errors: null, result: null });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).send({ success: false, message: settings.ERROR_MESSAGES.NO_TOKEN_PROVIDED, errors: null, result: null });
	}
}