const User = require('../../models/User');
const Course = require('../../models/Course');

// Obtener usuarios
exports.getUsers = (req, res) => {
	User.find({}, (err, doc) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			res.json(doc);
		}
	});
};

// Obtener usuario por id
exports.getUserById = (req, res) => {
	User.find({_id: req.params.id}, (err, doc) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			res.json(doc[0]);
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
			res.json({ message: 'Usuario registrado con exito' });
		}
	});
};


// Modificar usuario
exports.updateUser = (req, res) => {
	User.findOneAndUpdate({_id: req.params.id}, {$set: {
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
			res.send('Usuario modificado');
		}
	});
};

// Eliminar usuario
exports.deleteUser = (req, res) => {
	User.remove({_id: req.params.id}, (err, doc) => {
		if (err) {
			res.status(500).send({ message: err });
		}else{
			res.send('Usuario eliminado');
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
			res.json(doc);
		}
	});
};

// Agregar nuevos cursos
exports.insertCourses = (req, res) => {
	var data = new Course({
		name: req.body.name,
		description: req.body.description,
		tags: req.body.tags,
		user: req.body.user
	});

	data.save( (err) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			res.json({ message: 'Cursos agregado' });
		}
	});
		
};
