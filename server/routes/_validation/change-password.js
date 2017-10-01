const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

module.exports = [
	check('user')
		.exists().withMessage('El usuario es requerido'),
	check('passwords.old')
		.exists().withMessage('La contraseña es requerida')
		.matches(/\d/),
	check('passwords.new')
		.exists().withMessage('La contraseña es requerida')
		.isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
		.matches(/\d/)
];