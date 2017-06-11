const User = require('../../models/User');
const Course = require('../../models/Course');

// Obtener usuarios
exports.getUsers = (req, res) => {
	User.find({}, (err, doc) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			res.status(200).json(doc);
		}
	});
};

// Obtener usuario por id
exports.getUserById = (req, res) => {
	User.find({ _id: req.params.id }, (err, doc) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			res.status(200).json(doc[0]);
		}
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

// Obtener cursos
exports.getCourses = (req, res) => {
	Course.find({}, (err, doc) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			res.status(200).json(doc);
		}
	});
};

// Obtener cursos
exports.getCourseById = (req, res) => {
	Course.find({ _id: req.params.id }, (err, doc) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			res.status(200).json(doc[0]);
		}
	});
};

// Agregar nuevos cursos
exports.insertCourses = (req, res) => {
	console.log(req.body);
	var data = new Course({
		name: req.body.name,
		description: req.body.description,
		tags: req.body.tags,
		user: {
			id: req.body.user._id,
			name: req.body.user.name,
			lastName: req.body.user.lastName,
			nick: req.body.user.nick,
			mail: req.body.user.mail,
			profilePhoto: req.body.user.profilePhoto,
			backPhoto: req.body.user.backPhoto
		}
	});

	data.save( (err) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			res.status(200).json({ message: 'Curso agregado' });
		}
	});
		
};
