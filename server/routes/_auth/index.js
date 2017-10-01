const jwt = require('jsonwebtoken');
const settings = require('../settings');

exports.getAccessToken = (token, callback) => {
	// verifies secret and checks exp
	try {
		let decoded = jwt.verify(token, settings.SECRET);
		callback(null, decoded);
	} catch (err) {
		callback(err);
	}
}

exports.generateToken = function(data, callback) {
	// Use JWT for access tokens
	var token = jwt.sign(data, settings.SECRET, {
		expiresIn: settings.TOKEN_LIFETIME,
		subject: data._id.toString()
	});

	callback(null, token);
}

exports.saveAccessToken = function (token, clientId, expires, userId, callback) {
	console.log('in saveAccessToken (token: ' + token +
				', clientId: ' + clientId + ', userId: ' + userId.id +
				', expires: ' + expires + ')');

	//No need to store JWT tokens.
	console.log(jwt.decode(token, settings.SECRET));

	callback(null);
};