module.exports = {
	SECRET: 'Cl4v3Sup3rS3cr3t4',
	TOKEN_LIFETIME: 86400, // Time in seconds 24h

	MAIL_CONFIG : {
		'HOST': 'smtp.gmail.com',
		'PORT': 587,
		'SECURE': false,
		'ACCOUNT_USER': 'pueblobonito.develop@gmail.com',
		'ACCOUNT_PASSWORD': 'admin.123',
		'USER_NAME': 'SMDE Admin'
	},

	MESSAGES : {
		'SUCCESS': 'Éxito',
		'REGISTERED_USER': 'Usuario registrado',
		'MAIL_SENT': 'Se ha enviado un email a tu direccion de correo electrónico. Por favor revisa tu bandeja de entrada',
		'MAIL_SENT_TO': 'Se ha enviado un email a la direccion de correo electrónico:'
	},

	ERROR_MESSAGES : {
		'EMAIL_NOT_FOUND': 'EL correo electrónico no existe dentro de los registros',
		'BAD_LOGIN': 'Usuario y/o contraseña incorrectos',
		'BAD_PASSWORD': 'La contraseña anterior no conicide',
		'NO_TOKEN_PROVIDED': 'No se ha proporcionado autenticación (token)',
		'VALIDATION': 'Error en alguno de los campos enviados',
		'MAIL_NOT_SENT': 'Hubo un error para enviar el email, intentelo de nuevo más tarde'
	},

	HTTP_ERROR_MESSAGES : {
		'UNAUTHORIZED': 'Acceso denegado. Autenticación erronea o no proporcionada', // 401, 403
		'NOT_FOUND': 'Recurso no encontrado', // 400
		'INTERNAL_SERVER_ERROR': 'Error en el servidor' // 500
	}
}
