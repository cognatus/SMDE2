const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const settings = require('../settings');

const Course = require('../../models/Course');
const User = require('../../models/User');
const Notification = require('../../models/Notification');

exports.insertNotifications = (obj, callback) => {
	let asyncLoop = (i, subcallback) => {
		if ( i < obj.sendTo.length ) {
			let notif = new Notification({
				responsibleUsers: obj.responsibleUsers,
				action: obj.action,
				redirect: obj.redirect,
				sendTo: obj.sendTo[i] });

			notif.save( (err, doc) => {
				if (err) console.log(err);
				asyncLoop(i + 1, subcallback);
			});
		} else {
			subcallback(obj);
		}
	}
	asyncLoop(0, (data) => {
		callback(data);
	});
};

// Obtener notificaciones
exports.getNotifications = (req, res) => {
	let offset = req.query.offset ? parseInt(req.query.offset) : 0;
	let promise = Notification.find({ sendTo: req.decoded._id })
		.sort({'date': 'desc'}).skip(offset).limit(8)
		.exec();

	promise.then( (doc) => {
		return setUsers(doc);
	}).then( (data) => {
		setTimeout( () => {
			return res.status(200).json({ success: true, message: settings.MESSAGES.SUCCESS, errors: null, result: data });
		}, 1000);
	}).catch( (err) => {
		console.log(err);
		return res.status(500).send({ success: false, message: settings.HTTP_ERROR_MESSAGES.INTERNAL_SERVER_ERROR, errors: err, result: null });
	});
};

// Actualizar status de notifiacion (leido/no leido)
exports.updateNotifStatus = (req, res) => {
	let notifId = req.params.id;

	Notification.findOneAndUpdate({ _id: notifId }, { 
			$set: { read: req.body.status } })
		.exec()
		.then( (doc) => {
			return res.status(200).json({ success: true, message: settings.MESSAGES.SUCCESS, errors: null, result: null });
		}).catch( (err) => {
			console.log(err);
			return res.status(500).send({ success: false, message: settings.HTTP_ERROR_MESSAGES.INTERNAL_SERVER_ERROR, errors: err, result: null });
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
		}
		asyncLoop(0, (data) => {
			if (data) resolve(data);
			else reject('Error');
		})
	});
}