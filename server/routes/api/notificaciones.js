const mongoose = require('mongoose');

const Course = require('../../models/Course');
const User = require('../../models/User');
const Notification = require('../../models/Notification');

exports.insertNotifications = ( obj, callback ) => {
	if ( obj.sendTo.length > 0 ) {
		for ( let i = 0; i < obj.sendTo.length ; i++ ) {
			let notif = new Notification({
				responsibleUsers: obj.responsibleUsers,
				action: obj.action,
				redirect: obj.redirect,
				sendTo: obj.sendTo[i]
			});
			notif.save( (err, doc) => {
				if (err) {
					console.log('Error al insertar notificacion(es): ' + err);
					callback(err);
				} else {
					if ( i === obj.sendTo.length - 1 ) {
						callback(undefined, obj);
					}
				}
			});
		}
	} else {
		callback(undefined, obj);
	}
	
};

// Obtener notificaciones
exports.getNotifications = (userId, callback) => {
	Notification.find({ sendTo: userId }).sort({'date': 'desc'})
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
					getResponsibleUsers(doc[i].responsibleUsers, (err, array) => {
						if ( err ) {
							console.log(err)
						} else {
							data[i].responsibleUsers = array;
							if ( i === doc.length - 1 ) {
								callback(true, data);
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

	Notification.findOneAndUpdate({ _id: notifId }, { $set: { read: req.body.status } }, (err, doc) => {
		if (err) {
			console.log(err);
			res.status(500).send({ message: err });
		} else {
			res.status(200).send({ message: 'Exito al cambiar status de notificación' });
		}
	});
};

var getResponsibleUsers = (array, callback) => {
	User.find({ _id: { $in: array } }).select('_id name lastName profilePhoto').exec( (err, subdoc) => {
		if (err) {
			console.log(err);
			callback('Error al encontrar a los responsalbles. Error:');
		} else {
			callback(undefined, subdoc);
		}
	});
}