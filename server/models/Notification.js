var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
	responsibleUsers: { type: [String] },
	actionOn: { type: String }, // En que esta recayendo la notificación
	text: { type: String }, // texto de complemento
	action: { type: String }, // action para saber en que documento se modifico o creo
	date: { type: Date, required: true, default: new Date() },
	redirect: { type: String, required: true },
	sendTo: [{
		id: { type: String, required: true },
		read: { type: Boolean, required: true, default: false }
	}]
});

module.exports = mongoose.model('Notification', NotificationSchema);