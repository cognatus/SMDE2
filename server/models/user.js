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
	sex: Number,
	institute: [{
		_id: {type: String, required: true},
		name: {type: String, required:true}
	}],
	setting: {
		notifEmail: Boolean,
		notifApp: Boolean,
		msmColor: String,
		theme: Number
	},
	notification: [{
		_id: {type: String, required: true},
		date: {type: String, required: true},
		status: {type: Boolean, required: true},
		user: {type: String, required: true}
	}],
	course: [{
		_id: {type: String, required: true},
		subject: [{
			_id: {type: String, required: true},
			name: {type: String, required: true},
			level: {type: Number, required: true}
		}],
		group: [{
			_id: {type: String, required: true},
			name: {type: String, required: true},
			level: {type: Number, required: true}	
		}]
	}]
});

module.exports = mongoose.model('User', UserSchema);