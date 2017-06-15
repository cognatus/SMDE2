const mongoose = require('mongoose');

const Course = require('../../models/Course');
const User = require('../../models/User');

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

// Obtener curso por id
exports.getCourseById = (req, res) => {
	Course.find({ _id: req.params.id }, (err, doc) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			let course = doc[0];
			let membersToFind = course.members;
			let newCourse = course;

			if ( membersToFind != undefined && membersToFind.length > 0 ) {
				let findList = [];
				for ( let i = 0 ; i < membersToFind.length ; i++ ) {
					findList.push( membersToFind[i].id );
				}
				User.find({ _id: { $in: findList } }, (err, subdoc) => {
					if (err) {
						console.log(err);
						res.status(500).send({ message: 'Hubo un problema al encontrar a los miembros' })
					} else {
						for ( let i = 0 ; i < subdoc.length ; i++ ) {
							newCourse.members[i] = {
								group: membersToFind[i].group,
								user: {
									id: subdoc[i]._id,
									mail: subdoc[i].mail,
									name: subdoc[i].name,
									lastName: subdoc[i].lastName,
									profilePhoto: subdoc[i].profilePhoto,
									backPhoto: subdoc[i].backPhoto
								}
							};			
						}
						res.status(200).json(newCourse);
					}
				});
			} else {
				res.status(200).json(newCourse);
			}
		}
	});
};

// Agregar nuevos cursos
exports.insertCourse = (req, res) => {
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

exports.updateCourse = (req, res) => {
	let course = req.body;

	Course.findOneAndUpdate({ _id: course._id }, { $set: {
		name: req.body.name,
		lastName: req.body.lastName,
	}}, {new: false}, (err, doc) => {
		if (err) {
			res.status(500).send({ message: err });
		}else{
			res.send({ message: 'Usuario modificado' });
		}
	});
};

exports.deleteCourse = (req, res) => {
	Course.remove({ _id: req.params.id }, (err, doc) => {
		if (err) {
			res.status(500).send({ message: err });
		}else{
			res.send({ message: 'Curso eliminado' });
		}
	});
};

exports.suscribeUser = (req, res) => {
	let user = {
		id: req.body.id,
		group: req.body.group
	};

	Course.update({ _id: req.params.id }, {
		$push: { members: user }, $set: { updateDate: new Date() }
	}, (err, doc) => {
		if (err) {
			res.status(500).send({ message: err });
		}else{
			res.send({ message: 'Inscrito con exito' });
		}
	});
};

exports.unsuscribeUser = (req, res) => {
	let userId = req.cookies.login._id;
	Course.update({ _id: req.params.id }, {
		$pull: { members: { id: userId } }, $set: { updateDate: new Date() }
	}, (err, doc) => {
		if (err) {
			res.status(500).send({ message: err });
		}else{
			res.send({ message: 'Inscripción cancelada con exito' });
		}
	});
};