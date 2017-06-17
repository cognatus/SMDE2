const mongoose = require('mongoose');

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
										let notifSend = [{
											responsibleUsers: [req.cookies.login._id],
											action: {
												status: 2,
												substatus: 1,
												id: subdoc._id,
												element: groupName
											},
											redirect: '/cursos/' + req.params.id,
											sendTo: users
										}];

										notif.insertNotifications(notifSend, (err, array) => {
											if (err) {
												console.log(err);
												res.status(500).send({ message: 'Error al guardar la notificación' });
											} else {
												res.status(200).send({ message: 'Grupo creado con' + members.length + 'nuevos' });
											}
										});
									}
							});
						} else {
							let notifSend = [{
								responsibleUsers: [req.cookies.login._id],
								action: {
									status: 2,
									substatus: 0,
									id: subdoc._id,
									element: groupName
								},
								redirect: '/cursos/' + req.params.id,
								sendTo: users
							}];

							notif.insertNotifications(notifSend, (err, array) => {
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
				let oldGroupName = '';
				// buscar grupo por id para cambiar el nombre
				for ( let i = 0 ; i < groups.length ; i++ ) {
					if ( groups[i].id === groupId ) {
						oldGroupName = groups[i].name;
						groups[i].name = groupName;
						break;
					}
				}

				let users = doc.members;
				// Borrar grupo de usuarios
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
							break;
						}
					}
				}
				Course.findOneAndUpdate({ _id: req.params.id }, {
						$set: { members: users, groups: groups }
					}, (err, subdoc) => {
						if (err) {
							console.log(err);
							res.status(500).send({ message: 'Error al actualizar a los miembros en el grupo' });
						} else {
							let oldUsers = [];
							let newUsers = [];

							for ( let i = 0 ; i < doc.members.length ; i++ ) {
								oldUsers.push({ id: doc.members[i].id });
							}

							for ( let i = 0 ; i < doc.members.length; i++ ) { // Este ya esta bien
								if ( doc.members[i].group === groupId ) {
									for ( let j = 0 ; j < subdoc.members.length ; j++ ) {
										if ( subdoc.members[j].id !== doc.members[i].id ) {
											newUsers.push({ id: subdoc.members[j].id });
										}
									}
								}
							}

							for ( let i = 0 ; i < oldUsers.length ; i++ ) {
								for ( let j = 0 ; j < newUsers.length ; j++ ) {
									if ( oldUsers[i].id === newUsers[j].id ) {
										oldUsers.splice(i, 1);
									}
								}
							}

							let notifArray = [{
								responsibleUsers: [req.cookies.login._id],
								action: {
									status: 2,
									substatus: 2,
									id: subdoc._id,
									element: oldGroupName
								},
								redirect: '/cursos/' + req.params.id,
								sendTo: oldUsers
							}, {
								responsibleUsers: [req.cookies.login._id],
								action: {
									status: 2,
									substatus: 3,
									id: subdoc._id,
									element: groupName
								},
								redirect: '/cursos/' + req.params.id,
								sendTo: newUsers
							}];

							notif.insertNotifications(notifArray, (err, array) => {
								if (err) {
									console.log(err);
									res.status(500).send({ message: 'Error al guardar la notificación' });
								} else {
									res.status(200).send({ message: 'Grupo creado con' + members.length + 'nuevos' });
								}
							});
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
					let groups = doc.groups;
					let oldGroupName = '';

					for ( let i = 0 ; i < users.length ; i++ ) {
						if ( users[i].group === groupId ) {
							users[i].group = '';
						}
					}
					for ( let i = 0 ; i < groups.length ; i++ ) {
						if ( groups[i].id === groupId ) {
							oldGroupName = groups[i].name;
							break;
						}
					}

					Course.findOneAndUpdate({ _id: req.params.id }, {
							$set: { members: users }
						}, (err, subdoc) => {
							if (err) {
								console.log(err);
								res.status(500).send({ message: 'Error al eliminar a los miembros del grupo' });
							} else {
								if ( doc.members.length > 0 ) {
									let notifSend = [{
										responsibleUsers: [req.cookies.login._id],
										action: {
											status: 2,
											substatus: 0,
											id: subdoc._id,
											element: oldGroupName
										},
										redirect: '/cursos/' + req.params.id,
										sendTo: users
									}];

									notif.insertNotifications(notifSend, (err, array) => {
										if (err) {
											console.log(err);
											res.status(500).send({ message: 'Error al guardar la notificación' })
										} else {
											res.status(200).send({ message: 'Grupo creado con exito' });
										}
									});
								} else {
									res.status(200).send({ message: 'Grupo borrado' });
								}
							}
					});
			}
	});
};