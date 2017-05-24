const User = require('../../models/User');
const Subject = require('../../models/Subject');
const Group = require('../../models/Group');
/*const Course = require('../../models/Course');*/

// Obtener usuarios
exports.getUsers = (req, res) => {
	User.find({}, (err, doc) => {
		if (err) {
			console.log(err);
			res.send(err);
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
			res.send(err);
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
			res.send(err);
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
			res.send(err);
		}else{
			res.send('Usuario modificado');
		}
	});
};

// Eliminar usuario
exports.deleteUser = (req, res) => {
	User.remove({_id: req.params.id}, (err, doc) => {
		if (err) {
			res.send(err);
		}else{
			res.send('Usuario eliminado');
		}
	});
};

// Obtener asignaturas
exports.getSubjects = (req, res) => {
	Subject.find({}, (err, doc) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(doc);
		}
	});
};

// Agregar nueva asignatura
exports.insertSubject = (req, res) => {
	var data = new Subject({
		key: req.body.key,
		name: req.body.name,
		level: req.body.level,
		area: req.body.area
	});

	data.save( (err) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json({ message: 'Asignatura registrada' });
		}
	});
};

// Obtener asignatura por id
exports.getSubjectById = (req, res) => {
	Subject.find({_id: req.params.id}, (err, doc) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(doc[0]);
		}
	});
};

// Modificar asignatura
exports.updateSubject = (req, res) => {
	Subject.findOneAndUpdate({_id: req.params.id}, {$set: {
		key: req.body.key,
		name: req.body.name,
		level: req.body.level,
		area: req.body.area
	}}, {new: false}, (err, doc) => {
		if (err) {
			res.send(err);
		}else{
			res.send({ message: 'Asignatura modificada' });
		}
	});
};

// Eliminar asignatura
exports.deleteSubject = (req, res) => {
	Subject.remove({_id: req.params.id}, (err, doc) => {
		if (err) {
			res.send(err);
		}else{
			res.send({ message: 'Asignatura eliminada' });
		}
	});
};

// Obtener asignaturas
exports.getGroups = (req, res) => {
	Group.find({}, (err, doc) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(doc);
		}
	});
};

// Agregar nueva asignatura
exports.insertGroup = (req, res) => {
	var data = new Group({
		key: req.body.key,
		name: req.body.name,
		level: req.body.level,
		area: req.body.area
	});

	data.save( (err) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json({ message: 'Grupo registrada' });
		}
	});
};

// Obtener asignatura por id
exports.getGroupById = (req, res) => {
	Group.find({_id: req.params.id}, (err, doc) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(doc[0]);
		}
	});
};

// Modificar asignatura
exports.updateGroup = (req, res) => {
	Group.findOneAndUpdate({_id: req.params.id}, {$set: {
		key: req.body.key,
		name: req.body.name,
		level: req.body.level
	}}, {new: false}, (err, doc) => {
		if (err) {
			res.send(err);
		}else{
			res.send({ message: 'Grupo modificada' });
		}
	});
};

// Eliminar asignatura
exports.deleteGroup = (req, res) => {
	Group.remove({_id: req.params.id}, (err, doc) => {
		if (err) {
			res.send(err);
		}else{
			res.send({ message: 'Grupo eliminado' });
		}
	});
};
