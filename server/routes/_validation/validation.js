const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

module.exports = {
	LOGIN: [
		check('user')
			.exists().withMessage('El usuario es requerido')
			//.isEmail().withMessage('Debe ser un email con formato xxx@xxx.xx')
			.trim(),
			//.normalizeEmail()
			/*.custom(value => {
				return findUserByEmail(value).then(user => {
					throw new Error('this email is already in use');
				})
			}),*/
		check('password')
			.exists().withMessage('La contraseña es requerida')
			.isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
			.matches(/\d/),

		/*// No special validation required? Just check if data exists:
		check('addresses.*.street').exists(),

		// Wildcards * are accepted!
		check('addresses.*.postalCode').isPostalCode(),

		// Sanitize the number of each address, making it arrive as an integer
		sanitize('addresses.*.number').toInt()*/
	],
	CHANGEPASSWORD: [
		check('user')
			.exists().withMessage('El usuario es requerido'),
		check('passwords.old')
			.exists().withMessage('La contraseña es requerida')
			.matches(/\d/),
		check('passwords.new')
			.exists().withMessage('La contraseña es requerida')
			.isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
			.matches(/\d/)
	],
	RESETPASSWORD: [
		check('mail')
			.exists().withMessage('El usuario es requerido')
	]
}