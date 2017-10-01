const jwt = require('jsonwebtoken');
const settings = require('../settings');
const User = require('../../models/User');

exports.login = (req, res) => {
	let username = req.body.user;
	let password = req.body.password;

	User.findOne({ mail: username, password: password })
		.select('-password')
		.exec()
		.then( doc => {
			console.log(doc);
			if ( doc ) {
				let user = {
					_id: doc._id,
					mail: doc.mail,
					privilege: doc.privilege
				};
  				return res.status(200).json({ success: true, message: settings.MESSAGES.SUCCESS, errors: null, result: { user: doc } });
			} else {
				return res.status(404).send({ success: false, message: settings.ERROR_MESSAGES.BAD_LOGIN, errors: null, result: null });
			}
		}).catch( err => {
			res.status(500).send({ success: false, message: settings.HTTP_ERROR_MESSAGES.INTERNAL_SERVER_ERROR, errors: null, result: null })
		});
};

exports.logout = (req, res) => {
	res.redirect('/');
}

exports.signup = (req, res) => {
	let birthDay = {
		day: req.body.birthDay.split('/')[0], 
		month: req.body.birthDay.split('/')[1], 
		year: req.body.birthDay.split('/')[2]
	}
	let data = new User({
		mail: req.body.mail,
		nick: req.body.nick,
		password: req.body.password,
		name: req.body.name,
		lastName: req.body.lastName,
		phone: req.body.phone,
		birthDay: new Date(birthDay.year + '-' + birthDay.month + '-' + birthDay.day),
		type: req.body.userType,
		privilege: req.body.privilege
	});

	data.save( (err) => {
		if (err) {
			console.log(err);
			res.status(500).send({ success: false, message: settings.HTTP_ERROR_MESSAGES.INTERNAL_SERVER_ERROR, errors: err, result: null });
		} else {
			res.status(201).json({ success: true, message: settings.MESSAGES.REGISTERED_USER, errors: null, result: null });
		}
	});
};