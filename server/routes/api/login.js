const jwt = require('jsonwebtoken');
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
				_id: doc[0]._id,
				mail: doc[0].mail,
				password: doc[0].password,
				type: doc[0].type
			};
			
			let token = jwt.sign(userCookie._id, process.env.SECRET_KEY, { expiresIn: 400000 });
			let send = { user: doc[0], token: token };

			res.cookie('login', userCookie);
			res.json(send);
		}
	});
};

exports.logout = (req, res) => {
	res.clearCookie('login');
	req.session.destroy();
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
		password: req.body.password,
		name: req.body.name,
		lastName: req.body.lastName,
		phone: req.body.phone,
		birthDay: new Date(birthDay.year + '-' + birthDay.month + '-' + birthDay.day),
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