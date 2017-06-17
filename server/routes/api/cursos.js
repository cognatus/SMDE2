const mongoose = require('mongoose');

const Course = require('../../models/Course');
const User = require('../../models/User');
const Notification = require('../../models/Notification');

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

	Course.update({ _id: req.params.id }, {
		$push: { members: user }, $set: { updatedDate: new Date() }
	}, (err, doc) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		}else{
			res.status(200).json({ message: 'Inscrito con exito' });
		}
	});
};

exports.unsuscribeUser = (req, res) => {
	let userId = req.cookies.login._id;
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

exports.createGroup = (req, res) => {
	let members = req.body.users; // [id: string];
	let groupName = req.body.name; // string;

	Course.findOneAndUpdate({ _id: req.params.id }, {
			$push: { groups: { name: groupName } }, $set: { updatedDate: new Date() }
		}, (err, doc) => {
			if (err) {
				res.status(500).send({ message: err });
			} else {
				Course.findOne({ _id: req.params.id }, (err, subdoc) => {
					if (err) {
						console.log(err);
						res.status(500).send({ message: 'Hubo un error al encontrar el ultimo grupo insertado' })
					} else {
						let users = subdoc.members;
						let groups = subdoc.groups;

						for ( let i = 0 ; i < users.length ; i++ ) {
							if ( members.length > 0 ) {
								for ( let j = 0 ; j < members.length ; j++ ) {
									if ( users[i].id === members[j] ) {
										users[i].group = groups[groups.length - 1]._id;
									}
								}
							}
						}
						if ( members.length > 0 ) {
							Course.update({ _id: req.params.id }, { 
									$set: { members: users }
								}, (err, updateddoc) => {
									if (err) {
										console.log(err);
										res.status(500).send({ message: 'Error al insertar a los miembros en el grupo' });
									} else {
										let notif = new Notification({
											responsibleUsers: [req.cookies.login._id],
											actionOn: subdoc._id,
											text: 'ha creado el grupo ' + groupName + ' y te ha añadido a el en',
											action: 'course',
											redirect: '/cursos/' + req.params.id,
											sendTo: users
										});
										notif.save( (err) => {
											if (err) {
												console.log(err);
												res.status(500).send({ message: 'Error al guardar la notificación' })
											} else {
												res.status(200).send({ message: 'Grupo creado con' + members.length + 'nuevos' });
											}
										});
									}
							});
						} else {
							let notif = new Notification({
								responsibleUsers: [req.cookies.login._id],
								actionOn: subdoc._id,
								text: 'ha creado el grupo ' + groupName + ' en',
								action: 'course',
								redirect: '/cursos/' + req.params.id,
								sendTo: users
							});
							notif.save( (err) => {
								if (err) {
									console.log(err);
									res.status(500).send({ message: 'Error al guardar la notificación' })
								} else {
									res.status(200).send({ message: 'Grupo creado con exito' });
								}
							});
						}
					}
				});
			}
	});
};

exports.updateGroup = (req, res) => {
	let members = req.body.users; // [id:string];
	let groupName = req.body.name; // string;
	let groupId = req.params.groupid;

	Course.findOneAndUpdate({ _id: req.params.id }, {
			$set: { updatedDate: new Date() }
		}, (err, doc) => {
			if (err) {
				console.log(err);
				res.status(500).send({ message: err });
			} else {
				let groups = doc.groups;
				// buscar grupo por id para cambiar el nombre
				for ( let i = 0 ; i < groups.length ; i++ ) {
					if ( groups[i].id === groupId ) {
						groups[i].name = groupName;
						break;
					}
				}

				let users = doc.members;
				// borrar grupo de usuarios
				for ( let i = 0 ; i < users.length ; i++ ) {
					if ( users[i].group === groupId ) {
						users[i].group = '';
					}
				}

				// Colocar usuarios nuevamente
				for ( let i = 0 ; i < users.length ; i++ ) {
					for ( let j = 0 ; j < members.length ; j++ ) {
						if ( users[i].id === members[j] ) {
							users[i].group = groupId;
						}
					}
				}
				Course.update({ _id: req.params.id }, {
						$set: { members: users, groups: groups }
					}, (err, doc) => {
						if (err) {
							console.log(err);
							res.status(500).send({ message: 'Error al actualizar a los miembros en el grupo' });
						} else {
							res.status(200).send({ message: 'Grupo actualizado con' + members.length + 'nuevos' });
						}
				});
			}
	});
};

exports.deleteGroup = (req, res) => {
	let groupId = req.params.groupid;

	Course.findOneAndUpdate({ _id: req.params.id }, {
			$pull: { groups: { _id: groupId } }
		}, (err, doc) => {
			if (err) {
				console.log(err);
				res.status(500).send({ message: err });
			} else {
					let users = doc.members;
					for ( let i = 0 ; i < users.length ; i++ ) {
						if ( users[i].group === groupId ) {
							users[i].group = '';
						}
					}
					Course.update({ _id: req.params.id }, {
							$set: { members: users }
						}, (err, doc) => {
							if (err) {
								console.log(err);
								res.status(500).send({ message: 'Error al eliminar a los miembros del grupo' });
							} else {
								res.status(200).send({ message: 'Grupo borrado' });
							}
					});
			}
	});
};