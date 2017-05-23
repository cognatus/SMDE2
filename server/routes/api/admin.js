const User = require('../../models/User');
const Subject = require('../../models/Subject');
/*const Group = require('../../models/Group');
const Course = require('../../models/Course');*/

// Agregar un nuevo usuario (Admin, Alumno, Profesor)
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

// FUNCION PARA MOSTRAR TODOS LOS USUARIOS DE LA BASE PAPUH
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

// FUNCION PARA MOSTRAR TODOS LOS USUARIOS DE LA BASE POR SU ID
exports.getUserById = (req, res) => {

};

// Agregar nueva Asignatura
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

// FUNCION PARA MOSTRAR DATOS DE ASIGNATURAS DE LA BASE DE DATOS
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

// Agregar nuevo Curso
exports.insertCourse = (req, res) => {
	
	
};

// Agregar nuevo Grupo
exports.insertGroup = (req, res) => {
		
};

// FUNCION PARA MOSTRAR DATOS DE administradores DE LA BASE DE DATOS
exports.getAdministrators = (req, res) => {
	
};

// FUNCION PARA MOSTRAR DATOS DE ALUMNOS DE LA BASE DE DATOS
exports.getStudents = (req, res) => {


};

// FUNCION PARA MOSTRAR MATERIAS DE ALUMNOS DE LA BASE DE DATOS
exports.getStudentCourses = (req, res) => {
	

};

// FUNCION PARA MOSTRAR DATOS DE PROFESORES DE LA BASE DE DATOS
exports.getTeachers = (req, res) => {
	
};

// FUNCION PARA MOSTRAR MATERIAS DE PROFESOR DE LA BASE DE DATOS
exports.getTeacherSubjects = (req, res) => {
	

};

// FUNCION PARA MOSTRAR DATOS DE CURSOS DE LA BASE DE DATOS
exports.getCourses = (req, res) => {

};
