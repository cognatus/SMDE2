const mongoose = require('mongoose');

const Course = require('../../models/Course');
const User = require('../../models/User');
const Notification = require('../../models/Notification');

// Obtener notificaciones
exports.getNotifications = (userId, callback) => {
	Notification.find({ sendTo: { $elemMatch: { id: userId } } }, (err, doc) => {
		if (err) {
			console.log(err);
			callback(false, { message: err });
		} else {
			let data = [];
			if ( doc.length > 0 ) {
				for ( let i = 0 ; i < doc.length ; i++ ) {
					data.push({ _id: doc[i]._id, action: doc[i].action, actionOn: doc[i].actionOn, date: doc[i].date, redirect: doc[i].redirect, text: doc[i].text });
					for ( let j = 0 ; j < doc[i].sendTo.length ; j++ ) {
						if ( doc[i].sendTo[j].id === userId ) {
							data[i].read = doc[i].sendTo[j].read;
						}
					}
					if ( doc[i].responsibleUsers.length > 0 ) {
						User.find({ _id: { $in: doc[i].responsibleUsers } }, '_id name lastName profilePhoto' , (err, subdoc) => {
							if (err) {
								console.log(err);
								callback(false, { message: 'Error al encontrar a los responsalbles'});
							} else {
								data[i].responsibleUsers = subdoc;
								if ( doc[i].action && doc[i].action != '' ) {
									if ( doc[i].action === 'course' ) {
										Course.findOne({ _id: doc[i].actionOn }, 'name', (err, nameVal) => {
											if (err) {
												console.log(err);
												callback(false, data);
											} else {
												data[i].actionOn = nameVal.name;
												if ( i === ( doc.length - 1 ) ) {
													callback(true, data);
												}
											}
										});
									}
								} else {
									if ( i === ( doc.length - 1 ) ) {
										callback(true, data);
									}
								}
							}
						});
					} else {
						if ( i === ( doc.length - 1 ) ) {
							callback(true, data);
						}
					}
				}
			} else {
				callback(true, data);
			}
		}
	});
};

// Actualizar status de notifiacion (leido/no leido)
exports.updateNotifStatus = (req, res) => {
	let userId = req.body.user;
	let notifId = req.params.id;

	Notification.findOne({ _id: notifId }, (err, doc) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: 'Hubo un error al actualizar status de notificación' + err });
		} else {
			let aux = doc.sendTo;
			for ( let i = 0 ; i < aux.length ; i++ ) {
				if ( aux[i].id === userId ) {
					aux[i].read = !aux[i].read;
				}
			}
			Notification.findOneAndUpdate({ _id: notifId }, { 
					$set: { sendTo: aux }
				}, (err, doc) => {
					if (err) {
						console.log(err);
						res.status(500).send({ message: err });
					} else {
						res.status(200).send({ message: 'Exito al cambiar status de notificación' });
					}
			});
		}
	});
};