const validationResult = require('express-validator/check').validationResult;
const validation = require('../_validation');
const settings = require('../settings');

module.exports = function(auth) { 
	return function(req, res, next) {
		if ( auth && !req.headers.authorization ) {
			return res.status(401).send({ success: false, responseMessage: settings.ERROR_MESSAGES.NO_TOKEN_PROVIDED, responseErrors: null, responseResult: null });
		}

		const errors = validationResult(req);
		if ( !errors.isEmpty() ) {
			return res.status(422).send({ success: false, responseMessage: settings.ERROR_MESSAGES.VALIDATION, responseErrors: errors.mapped(), responseResult: null });
		}
		next();
	}
}