const settings = require('../settings');
const User = require('../../models/User');

// Obtener usuarios
exports.getUsers = (req, res, next) => {
	console.log(req.decoded);
	User.find({})
		.then( doc => {
			return res.status(200).json({ success: true, message: settings.MESSAGES.SUCCESS, errors: null, result: { users: doc } });
		}).catch( err => {
			console.log(err);
			return res.status(500).send({ success: false, message: settings.HTTP_ERROR_MESSAGES.INTERNAL_SERVER_ERROR, errors: err, result: null });
		});
};

// Obtener usuario por id
exports.getUserById = (req, res) => {
	User.findOne({ _id: req.params.id })
		.select('-password -notification')
		.then( doc => {
			if ( !doc )
				return res.status(404).json({ success: true, message: settings.HTTP_ERROR_MESSAGES.NOT_FOUND, errors: null, result: null });
			res.status(200).json({ success: true, message: settings.MESSAGES.SUCCESS, errors: null, result: { user: doc } });
		}).catch( err => {
			console.log(err);
			return res.status(500).send({ success: false, message: settings.HTTP_ERROR_MESSAGES.INTERNAL_SERVER_ERROR, errors: err, result: null });
		});
};

// Agregar nuevo usuario (Admin, Alumno, Profesor)
exports.insertUser = (req, res) => {
	let birthDay = {
		day: req.body.birthDay.split('/')[0], 
		month: req.body.birthDay.split('/')[1], 
		year: req.body.birthDay.split('/')[2]
	}

	var data = new User({
		mail: req.body.mail,
		password: req.body.password,
		name: req.body.name,
		lastName: req.body.lastName,
		phone: req.body.phone,
		birthDay: new Date(birthDay.year + '-' + birthDay.month + '-' + birthDay.day),
		type: req.body.userType,
		sex: req.body.sex,
	});

	data.save( (err) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			res.status(200).json({ message: 'Usuario registrado con exito' });
		}
	});
};

// Modificar usuario
exports.updateUser = (req, res) => {
	User.findOneAndUpdate({ _id: req.params.id }, {$set: {
		mail: req.body.mail,
		password: req.body.password,
		name: req.body.name,
		lastName: req.body.lastName,
		birthDay: req.body.birthDay,
		type: req.body.type,
		sex: req.body.sex
	}}, {new: false}, (err, doc) => {
		if (err) {
			res.status(500).send({ message: err });
		}else{
			res.send({ message: 'Usuario modificado' });
		}
	});
};

// Eliminar usuario
exports.deleteUser = (req, res) => {
	User.remove({ _id: req.params.id }, (err, doc) => {
		if (err) {
			res.status(500).send({ message: err });
		}else{
			res.send({ message: 'Usuario eliminado' });
		}
	});
};