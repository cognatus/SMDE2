const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

module.exports = [
	check('user')
		.exists().withMessage('El usuario es requerido')
		.isEmail().withMessage('Formato de email invalido')
		.trim(),
	check('password')
		.exists().withMessage('La contraseña es requerida')
		.isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
		.matches(/\d/)
];