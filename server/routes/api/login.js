const User = require('../../models/User');

exports.login = (req, res) => {
	let data = {
		mail: req.body.mail,
		password: req.body.password
	}
	User.find(data, (err, doc) => {
		if (err) {
			res.send(err);
		} else {
			let userCookie = {
				mail: doc[0].mail,
				password: doc[0].password,
				type: doc[0].type
			}
			res.cookie('login', userCookie);
			res.json(doc);
		}
	});
};

exports.logout = (req, res) => {
	res.clearCookie('login');
	req.session.destroy();
	res.redirect('/');
}

exports.signup = (req, res) => {
	var data = new User({
		mail: req.body.mail,
		password: req.body.password,
		name: req.body.name,
		lastName: req.body.lastName,
		phone: req.body.phone,
		birthDay: req.body.birthDay,
		type: req.body.userType
	});

	data.save( (err) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.send('Usuario registrado con exito');
		}
	});
};