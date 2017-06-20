const jwt = require('jsonwebtoken');
const randtoken = require('rand-token') 
const User = require('../../models/User');

let refreshTokens = {};

exports.login = (req, res) => {
	let username = req.body.mail;
	let password = req.body.password;

	User.findOne({ mail: req.body.mail, password: req.body.password }).select('-password').exec( (err, doc) => {
		if (err) {
			res.send(err);
		} else {
			let user = {};
			if ( doc ) {
				user = {
					_id: doc._id,
					mail: doc.mail,
					privilege: doc.privilege
				};
				
				let token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 400000 });
				let refreshToken = randtoken.uid(256);
  				refreshTokens[refreshToken] = username;
  				res.cookie('urtoken', user);
  				res.status(200).json({ user: doc, token: 'JWT ' + token, refreshToken: refreshToken });
			} else {
				res.status(500).send({ message: 'Usuario y/o contraseña incorrectos' });
			}
		}
	});
};

exports.logout = (req, res) => {
	res.clearCookie('urtoken');
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