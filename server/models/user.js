var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	mail: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	name: {type: String, required: true},
	lastName: {type: String, required: true},
	phone: {type: Number, required: true},
	birthDay: {type: Date, required: true},
	type: {type: Number, required: true}, // Privilegio
	createDate: {type: Date, required: true, default: new Date()},
	sex: Number,
	profilePhoto: String,
	backPhoto: String,
	updateDate: {type: Date, default: new Date()},
	institute: [{
		name: {type: String, required:true},
		level: {type: String, required:true}
	}],
	settings: {
		notifEmail: Boolean,
		msmColor: String,
		primaryColor: String,
		theme: Number
	},
	notification: [{
		id: {type: String, required: true},
		date: {type: String, required: true},
		status: {type: Boolean, required: true},
		user: {type: String, required: true}
	}],
	course: [{
		subject: {
			id: {type: String, required: true},
			name: {type: String, required: true},
			level: {type: Number, required: true}
		},
		group: {
			id: {type: String, required: true},
			name: {type: String, required: true},
			level: {type: Number, required: true}
		}
	}],
	photos: [{
		name: {type: String, required: true},
		description: {type: String},
		uploadDate: {type: Date, required: true, default: new Date()},
		tags: {type: String},
		album: {type: String},
	}],
	profilePhoto: {type: String},
	backPhoto: {type: String}
});

module.exports = mongoose.model('User', UserSchema);