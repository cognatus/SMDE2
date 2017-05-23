const User = require('../../models/User');
const Subject = require('../../models/Subject');
/*const Group = require('../../models/Group');
const Course = require('../../models/Course');*/

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
			res.json(doc);
		}
	});
};

// Agregar nuevo usuario (Admin, Alumno, Profesor)
exports.insertUser = (req, res) => {
	var data = new User({
		mail: req.body.mail,
		password: req.body.password,
		name: req.body.name,
		lastName: req.body.lastName,
		birthDay: req.body.birthDay,
		type: req.body.type,
		sex: req.body.sex
	});

	data.save( (err, doc) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.send('Usuario registrado con exito');
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

	data.save( (err, doc) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.send('Asignatura registrada');
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
			res.json(doc);
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
			res.send('Asignatura modificada');
		}
	});
};

// Eliminar asignatura
exports.deleteSubject = (req, res) => {
	Subject.remove({_id: req.params.id}, (err, doc) => {
		if (err) {
			res.send(err);
		}else{
			res.send('Asignatura eliminada');
		}
	});
};

// Agregar nuevo Curso
exports.insertCourse = (req, res) => {
	
};

// Agregar nuevo Grupo
exports.insertGroup = (req, res) => {
		
};

// FUNCION PARA MOSTRAR DATOS DE CURSOS DE LA BASE DE DATOS
exports.getCourses = (req, res) => {

};
