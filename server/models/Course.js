var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
	tags: [],
	createdDate: { type: Date, required: true, default: new Date() },
	updatedDate: { type: Date, default: new Date() },
	private: { type: Boolean, required: true },
	user: {
		id: { type: String, required: true },
		name: { type: String, required: true },
		lastName: { type: String, required: true },
		nick: { type: String },
		mail: { type: String, required: true },
		profilePhoto: { type: String },
		backPhoto: { type: String }
	},
	members: [{
		id: { type: String, required: true },
		name: { type: String, required: true },
		lastName: { type: String, required: true },
		nick: { type: String },
		mail: { type: String, required: true },
		profilePhoto: { type: String },
		backPhoto: { type: String }
	}],
	section: [{
		name: { type: String, required: true },
		subsection: [{
			name: { type: String, required: true },
		}]
	}]
});

module.exports = mongoose.model('Course', CourseSchema);