const mongoose = require('mongoose');

const Course = require('../../models/Course');
const User = require('../../models/User');
const Notification = require('../../models/Notification');

exports.insertNotifications = ( array, callback ) => {
	for ( let i = 0 ; i < array.length ; i++ ) {
		if ( array[i].sendTo.length < 1 ) {
			array.splice(i ,1);
		}
	}

	Notification.create( array, (err, doc) => {
		if (err) {
			console.log('Error al insertar notificacion(es): ' + err);
			callback(err);
		} else {
			callback(undefined, array);
		}
	});
};

// Obtener notificaciones
exports.getNotifications = (userId, callback) => {
	Notification.find({ sendTo: { $elemMatch: { id: userId } } }).sort({'date': 'desc'})
     .exec( (err, doc) => {
		if (err) {
			console.log(err);
			callback(false, { message: err });
		} else {
			let data = [];
			if ( doc.length > 0 ) {
				for ( let i = 0 ; i < doc.length ; i++ ) {
					data.push({ _id: doc[i]._id, action: doc[i].action, date: doc[i].date, redirect: doc[i].redirect, actionOn: '' });
					for ( let j = 0 ; j < doc[i].sendTo.length ; j++ ) {
						if ( doc[i].sendTo[j].id === userId ) {
							data[i].read = doc[i].sendTo[j].read;
						}
					}
					User.find({ _id: { $in: doc[i].responsibleUsers } }).select('_id name lastName profilePhoto').exec( (err, subdoc) => {
						if (err) {
							console.log(err);
							callback(false, { message: 'Error al encontrar a los responsalbles'});
						} else {
							data[i].responsibleUsers = subdoc;
							if ( doc[i].action.status > 0 && doc[i].action.status < 3 ) {
								Course.findOne({ _id: data[i].action.id }).select('name').exec( (err, nameval) => {
									if (err) {
										console.log(err);
										callback(false, { message: 'Error al encontrar el curso' });
									} else {
										data[i].actionOn = nameval.name;
										if ( i === doc.length - 1 ) {
											callback(true, data);
										}
									}
								});
							}
						}
					});
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