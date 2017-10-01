const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

module.exports = [
	check('mail')
		.exists().withMessage('El usuario es requerido')
];