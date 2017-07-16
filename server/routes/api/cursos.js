const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const Course = require('../../models/Course');
const User = require('../../models/User');
const notif = require('./notificaciones');

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
	Course.findOne({ _id: req.params.id }).exec()
		.then( (doc) => {
			return getUsers(doc);
		}).then( (data) => {
			let aux = data;
			let asyncLoop = ( i, callback ) => {
				if ( i < aux[1].length ) {
					aux[0].members[i] = {
						group: data[0].members[i].group,
						user: data[1][i]
					}
					asyncLoop(i+1, callback);
				} else {
					callback(aux[0]);
				}
			}
			asyncLoop(0, (course) => {
				res.status(200).json(course);
			});
		}).catch( (err) => {
			console.log(err);
			res.status(404).send({ message: err });
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
			res.status(200).json({ message: 'Usuario modificado' });
		}
	});
};

exports.deleteCourse = (req, res) => {
	Course.remove({ _id: req.params.id }, (err, doc) => {
		if (err) {
			res.status(500).send({ message: err });
		}else{
			res.status(200).json({ message: 'Curso eliminado' });
		}
	});
};

exports.suscribeUser = (req, res) => {
	let user = { id: req.body.id, group: req.body.group };

	Course.findOneAndUpdate({ _id: req.params.id }, {
		$push: { members: user }, $set: { updatedDate: new Date() }
	}, (err, doc) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			let notifSend = {
				responsibleUsers: [user.id],
				action: {
					status: 2,
					substatus: 1,
					element: [doc.name]
				},
				redirect: '/cursos/' + req.params.id,
				sendTo: user
			};
			notif.insertNotifications(notifSend, (err, data) => {
				if (err) {
					console.log(err);
				} else {

				}
			});
			res.status(200).json({ message: 'Inscrito con exito' });
		}
	});
};

exports.unsuscribeUser = (req, res) => {
	let userId = req.cookies.urtoken._id;
	Course.update({ _id: req.params.id }, {
		$pull: { members: { id: userId } }, $set: { updatedDate: new Date() }
	}, (err, doc) => {
		if (err) {
			res.status(500).send({ message: err });
		}else{
			res.status(200).json({ message: 'Inscripción cancelada con exito' });
		}
	});
};

function getUsers(array) {
	return new Promise( (resolve, reject) => {
		let findList = [];
		for ( let i = 0; i < array.members.length ; i++ ) {
			findList.push(array.members[i].id);
		}
		User.find({ _id: { $in: findList } })
			.select('_id name lastName mail profilePhoto backPhoto')
			.exec()
			.then( (users) => {
				resolve([array, users]);
			}).catch( (err) => {
				console.log(err);
				reject('Error' + err);
			});
	})
}