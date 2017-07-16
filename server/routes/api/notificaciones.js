const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const Course = require('../../models/Course');
const User = require('../../models/User');
const Notification = require('../../models/Notification');

exports.insertNotifications = ( obj, callback ) => {
	let date = new Date();
	let asyncLoop = (i, subcallback) => {
		if ( i < obj.sendTo.length ) {
			let notif = new Notification({
				responsibleUsers: obj.responsibleUsers,
				action: obj.action,
				redirect: obj.redirect,
				date: date,
				sendTo: obj.sendTo[i] });

			notif.save( (err, doc) => {
				if (err) console.log(err);
				asyncLoop(i+1, subcallback);
			});
		} else {
			subcallback(obj);
		}
	};
	asyncLoop(0, (data) => {
		callback(undefined, data);
	});
};

// Obtener notificaciones
exports.getNotifications = (req, res) => {
	let promise = Notification.find({ sendTo: req.cookies.urtoken._id })
		.sort({'date': 'desc'})
		.exec();

	promise.then( (doc) => {
		return setUsers(doc);
	}).then( (data) => {
		res.status(200).json(data);
	}).catch( (err) => {
		console.log(err);
		res.status(404).send({ message: err })
	});
};

// Actualizar status de notifiacion (leido/no leido)
exports.updateNotifStatus = (req, res) => {
	let notifId = req.params.id;

	Notification.findOneAndUpdate({ _id: notifId }, { 
			$set: { read: req.body.status } 
		}).exec()
		.then( (doc) => {
			res.status(200).send({ message: 'Exito al cambiar status de notificación' });
		}).catch( (err) => {
			console.log(err);
			res.status(500).send({ message: err });
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

function setUsers(array) { // recive notif doc to change responsible users and get the real info
	let aux = [];
	return new Promise( (resolve, reject) => {
		let asyncLoop = (i, callback) => {
			if ( i < array.length ) {
				getUsers(array[i].responsibleUsers, (users) => {
					aux.push({ _id: array[i]._id,
						action: array[i].action,
						date: array[i].date,
						redirect: array[i].redirect,
						read: array[i].read,
						responsibleUsers: users });

					asyncLoop(i+1, callback);
				});
			} else {
				callback(aux);
			}
		};
		asyncLoop(0, (data) => {
			if (data) resolve(data);
			else reject('Error');
		})
	});
}