const jwt = require('jsonwebtoken');
const settings = require('../settings');
const validationResult = require('express-validator/check').validationResult;

module.exports = (req, res, next) => {
	let errors = validationResult(req);

	if ( !errors.isEmpty() ) {
		return res.status(422).send({ success: false, message: settings.ERROR_MESSAGES.VALIDATION, errors: errors.mapped(), result: null });
	}
	next();
}