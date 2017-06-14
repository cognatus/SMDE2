var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	mail: { type: String, required: true, unique: true },
	nick: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	lastName: { type: String, required: true },
	phone: { type: Number, required: true },
	birthDay: { type: Date, required: true },
	privilege: { type: Number, required: true },
	sex: Number,
	createDate: { type: Date, required: true, default: new Date() },
	updateDate: { type: Date, default: new Date() },
	institute: [{
		name: { type: String, required:true },
		level: { type: String, required:true }
	}],
	settings: {
		notifEmail: Boolean,
		msmColor: String,
		primaryColor: String,
		theme: Number
	},
	notification: [{
		id: { type: String, required: true },
		date: { type: String, required: true },
		status: { type: Boolean, required: true },
		text: { type: String, required: true }
	}],
	tags: [String],
	photos: [{
		name: { type: String, required: true },
		description: { type: String},
		uploadDate: { type: Date, required: true, default: new Date()},
		tags: { type: String},
		album: { type: String},
	}],
	profilePhoto: String,
	backPhoto: String
});

module.exports = mongoose.model('User', UserSchema);