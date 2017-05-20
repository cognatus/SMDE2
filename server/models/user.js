var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	_id: {type: String, required: true},
	name: {type: String, required: true},
	lastName: {type: String, required: true},
	sex: String,
	phone: {type: Number, required: true},
	mail: String,
	password: {type: String, required: true},
	type: {type: Number, required: true}, // Privilegio
	birthDay: {type: Date, required: true},
	institute: [{
		_id: {type: String, required: true},
		name: {type: String, required:true}
	}]
	setting: {
		notifEmail: Boolean,
		notifApp: Boolean,
		msmColor: String,
		theme: Number
	},
	notification: [{
		_id: {type: String, required: true}
		date: {type: String, required: true},
		status: {type: Boolean, required: true},
		user: {type: String, required: true}
	}]
	course: [{
		_id: {type: String, required: true},
		subject: [{
			_id: {type: String, required: true},
			name: {type: String, required: true},
			level: {type: Number, required: true}, 
		}]
		group: [{
			_id: {type: String, required: true},
			name: {type: String, required: true},
			level: {type: Number, required: true}, 	
		}]
	}]
});

module.exports = mongoose.model('User', UserSchema);