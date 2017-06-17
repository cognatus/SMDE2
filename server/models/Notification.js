var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
	responsibleUsers: { type: [String] },
	action: { // De este dependera el texto que se envia
		status: { type: Number, required: true },
		substatus: { type: Number },
		id: { type: String },
		element: { type: String }
	},
	date: { type: Date, required: true, default: new Date() },
	redirect: { type: String, required: true },
	sendTo: [{
		id: { type: String, required: true },
		read: { type: Boolean, required: true, default: false }
	}]
});

module.exports = mongoose.model('Notification', NotificationSchema);