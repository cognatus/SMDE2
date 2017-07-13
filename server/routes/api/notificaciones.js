const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

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
					if ( i === (obj.sendTo.length - 1) ) {
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
exports.getNotifications = (req, res) => {
	let promise = Notification.find({ sendTo: req.cookies.urtoken._id })
		.sort({'date': 'desc'})
		.exec();

	promise.then( (doc) => {
		const promises = doc.map( (item) => {
			let aux = item.responsibleUsers;
			return setUsers(aux).then( (users) => {
				item.responsibleUsers = users;
			});
		});
		console.log(promises);
	}).then( (data) => {
		res.status(200).json(data);
	}).catch( (err) => {
		console.log(err);
	});
};

// Actualizar status de notifiacion (leido/no leido)
exports.updateNotifStatus = (req, res) => {
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

function getUsers(array, callback) {
	User.find({ _id: { $in: array } })
		.select('_id name lastName profilePhoto')
		.exec( (err, doc) => {
			if (err) {
				return console.log(err);
			}
			callback(doc);
		});
}

function setUsers(array) {
	return new Promise( (fulfill, reject) => {
		getUsers(array, (users) => {
			if (users) fulfill(users);
			else reject('Error');
		});
	})
}