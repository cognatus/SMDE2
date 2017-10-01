const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const async = require('async');

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
				responsibleUsers: [req.decode._id],
				action: {
					status: 2,
					substatus: 1,
					element: [groupName, doc.name]
				},
				redirect: '/cursos/' + req.params.id,
				sendTo: usersInGroup
			}, (obj) => {
				
			});

			notif.insertNotifications({
				responsibleUsers: [req.decode._id],
				action: {
					status: 2,
					substatus: 0,
					element: [groupName, doc.name]
				},
				redirect: '/cursos/' + req.params.id,
				sendTo: usersNotInGroup
			}, (obj) => {

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

	let oldMembers = [];
	let newMembers = [];
	let oldGroupName = '';

	Course.findOne({ _id: courseId }).exec()
		.then( (doc) => {
			return new Promise( (resolve, reject) => {
				async.waterfall([
					function(callback) {
						for ( let i = 0 ; i < doc.members.length ; i++ ) {
							if ( doc.members[i].group === groupId ) {
								oldMembers.push(doc.members[i].id);
							}
						}
						callback(null);
					}, function(callback) {
						let users = doc.members;
						// Borrar grupo de usuarios
						for ( let i = 0 ; i < users.length ; i++ ) {
							if ( users[i].group === groupId ) {
								users[i].group = null;
							}
						}
						callback(null, users);
					}, function(users, callback) {
						let groups = doc.groups;
						// buscar grupo por id para cambiar el nombre
						for ( let i = 0 ; i < groups.length ; i++ ) {
							if ( groups[i].id === groupId ) {
								oldGroupName = groups[i].name;
								groups[i].name = groupName;
								break;
							}
						}
						callback(null, groups, users)
					}, function(groups, users, callback) {
						// Colocar usuarios nuevamente
						for ( let i = 0 ; i < users.length ; i++ ) {
							for ( let j = 0 ; j < members.length ; j++ ) {
								if ( users[i].id === members[j] ) {
									users[i].group = groupId;
									break;
								}
							}
						}
						callback(null, [users, groups])
					}
				], function(err, result) {
					if (err) reject('Error');
					else resolve([result[0], result[1]]);
				});
			});
		}).then( (data) => {
			return Course.findOneAndUpdate({ _id: courseId }, {
					$set: { 
						members: data[0], 
						groups: data[1],
						updatedDate: new Date() 
					} 
				}).exec();
		}).then( (data) => {
			for ( let i = 0 ; i < members.length ; i++ ) {
				if ( oldMembers.indexOf(members[i]) < 0 ) {
					newMembers.push(members[i]);
				}
			}

			notif.insertNotifications({
				responsibleUsers: [req.decode._id], // Mandar a miembros viejos del grupo
				action: {
					status: 2,
					substatus: 2,
					element: [oldGroupName, data.name]
				},
				redirect: '/cursos/' + courseId,
				sendTo: oldMembers
			}, (obj) => {
				notif.insertNotifications({
					responsibleUsers: [req.decode._id], //Mandar a miembros nuevos en el grupo
					action: {
						status: 2,
						substatus: 3,
						id: data._id,
						element: [groupName, data.name]
					},
					redirect: '/cursos/' + courseId,
					sendTo: newMembers
				}, (obj) => {
					res.status(200).send({ message: 'Grupo editado correctamente' });
				});
			});
		}).catch( (err) => {
			console.log(err);
			res.status(404).send({ message: err });
		});
};

exports.deleteGroup = (req, res) => {
	let groupId = req.params.groupid;
	let courseId = req.params.id;
	let oldGroupName = '';
	let oldMembers = [];

	Course.findOneAndUpdate({ _id: courseId }, {
			$pull: { groups: { _id: groupId } }
		}).exec()
		.then( (doc) => {
			return new Promise( (resolve, reject) => {
				async.waterfall([
					function(callback) {
						let users = doc.members;
						for ( let i = 0 ; i < users.length ; i++ ) {
							oldMembers.push(users[i].id);
							if ( users[i].group === groupId ) {
								users[i].group = null;
							}
						}
						callback(null, users);
					}, function(users, callback) {
						let groups = doc.groups;
						for ( let i = 0 ; i < groups.length ; i++ ) {
							if ( groups[i].id === groupId ) {
								oldGroupName = groups[i].name;
								break;
							}
						}
						callback(null, users)
					}
				], function(err, result) {
					if (err) reject('Error');
					else resolve(result);
				});
			});
		}).then( (data) => {
			return Course.findOneAndUpdate({ _id: courseId }, {
					$set: { members: data }
				}).exec()
		}).then( (data) => {
			notif.insertNotifications({
				responsibleUsers: [req.decode._id],
				action: {
					status: 2,
					substatus: 5, // grupo eliminado
					element: [oldGroupName, data.name]
				},
				redirect: '/cursos/' + courseId,
				sendTo: oldMembers
			}, (obj) => {
				res.status(200).send({ message: 'Grupo borrado' });
			});
		}).catch( (err) => {
			console.log(err);
			res.status(404).send({ message: err });
		});
};