const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const Course = require('../../models/Course');
const User = require('../../models/User');
const notif = require('./notificaciones');

exports.createGroup = (req, res) => {
	let members = req.body.users; // [id: string];
	let groupName = req.body.name; // string;
	let courseId = req.params.id;

	Course.findOneAndUpdate({ _id: courseId }, {
			$push: { groups: { name: groupName } }, 
			$set: { updatedDate: new Date() }
		}).exec().then( (doc) => {
			return Course.findOne({ _id: courseId }).exec()
				.then( (subdoc) => {
					return subdoc;
				})
		}).then( (doc) => {
			let users = doc.members;
			let groups = doc.groups;
			let usersInGroup = [];
			let usersNotInGroup = [];
			let lastGroup = groups[groups.length-1]._id;

			for ( let i = 0 ; i < users.length ; i++ ) {
				for ( let j = 0 ; j < members.length ; j++ ) {
					if ( users[i].id === members[j] ) {
						users[i].group = lastGroup;
					}
				}
			}

			for ( let i = 0 ; i < users.length; i++ ) {
				if ( members.indexOf(users[i].id) > -1 ) {
					usersInGroup.push(users[i].id);
				} else {
					usersNotInGroup.push(users[i].id);
				}
			}

			notif.insertNotifications({
				responsibleUsers: [req.cookies.urtoken._id],
				action: {
					status: 2,
					substatus: 1,
					element: [groupName, doc.name]
				},
				redirect: '/cursos/' + req.params.id,
				sendTo: usersInGroup
			}, (err, obj) => {
				if (err) console.log(err);
			});

			notif.insertNotifications({
				responsibleUsers: [req.cookies.urtoken._id],
				action: {
					status: 2,
					substatus: 0,
					element: [groupName, doc.name]
				},
				redirect: '/cursos/' + req.params.id,
				sendTo: usersNotInGroup
			}, (err, obj) => {
				if (err) console.log(err);
			});

			Course.update({ _id: req.params.id }, { $set: { members: users } }).exec()
				.then( (subdoc) => {
					res.status(200).send({ message: 'Grupo creado con ' + members.length + ' miembros nuevos' });
				});
		}).catch( (err) => {
			console.log(err);
			res.status(500).send({ message: err });
		});
};

exports.updateGroup = (req, res) => {
	let members = req.body.users; // [id:string];
	let groupName = req.body.name; // string;
	let groupId = req.params.groupid;
	let courseId = req.params.id;

	let oldUsers = [];
	let oldGroupName = '';

	Course.findOne({ _id: courseId }).exec()
		.then( (doc) => {
			return new Promise( (resolve, reject) => {
				let groups = doc.groups;
				let users = doc.members;
				// buscar grupo por id para cambiar el nombre
				for ( let i = 0 ; i < groups.length ; i++ ) {
					if ( groups[i].id === groupId ) {
						oldGroupName = groups[i].name;
						groups[i].name = groupName;
						break;
					}
				}

				for ( let i = 0 ; i < doc.members.length ; i++ ) {
					if ( doc.members[i].group === groupId ) {
						oldUsers.push(doc.members[i].id);
					}
				}

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
				resolve([users, groups]);
			})
		}).then( (data) => {
			return Course.findOneAndUpdate({ _id: courseId }, {
					$set: { members: data[0], groups: data[1], updatedDate: new Date() } 
				}).exec()
				.then( (doc) => {
					notif.insertNotifications({
						responsibleUsers: [req.cookies.urtoken._id], // Mandar a miembros viejos del grupo
						action: {
							status: 2,
							substatus: 2,
							element: [oldGroupName, doc.name]
						},
						redirect: '/cursos/' + courseId,
						sendTo: oldUsers
					}, (err, obj) => {
						if (err) console.log(err);
					});
					return doc;	
				});
		}).then( (data) => {
			let newUsers = [];

			for ( let i = 0 ; i < members.length ; i++ ) {
				if ( oldUsers.indexOf(members[i]) < 0 ) {
					newUsers.push(members[i]);
				}
			}

			notif.insertNotifications({
				responsibleUsers: [req.cookies.urtoken._id], //Mandar a miembros nuevos en el grupo
				action: {
					status: 2,
					substatus: 3,
					id: data._id,
					element: [groupName, data.name]
				},
				redirect: '/cursos/' + courseId,
				sendTo: newUsers
			}, (err, obj) => {
				if (err) console.log(err);
			});

			res.status(200).send({ message: 'Grupo editado correctamente' });
		}).catch( (err) => {
			console.log(err);
			res.status(404).send({ message: err });
		});
};

exports.deleteGroup = (req, res) => {
	let groupId = req.params.groupid;
	let courseId = req.params.id;

	Course.findOneAndUpdate({ _id: courseId }, {
			$pull: { groups: { _id: groupId } }
		}).exec()
		.then( (doc) => {
			return new Promise( (resolve, reject) => {
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
				resolve([users, oldGroupName]);
			});
		}).then( (data) => {
			Course.findOneAndUpdate({ _id: courseId }, {
					$set: { members: data[0] }
				}).then( (doc) => {
					notif.insertNotifications({
						responsibleUsers: [req.cookies.urtoken._id],
						action: {
							status: 2,
							substatus: 5, // grupo eliminado
							element: [data[1], doc.name]
						},
						redirect: '/cursos/' + courseId,
						sendTo: data[0]
					}, (err, obj) => {
						if (err) console.log(err);
					});
					res.status(200).send({ message: 'Grupo borrado' });
			}).catch( (err) => {
				console.log(err);
				res.status(500).send({ message: err });
			});
		}).catch( (err) => {
			console.log(err);
			res.status(404).send({ message: err });
		});
};