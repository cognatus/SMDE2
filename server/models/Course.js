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
	activities: [{
		title: { type: String, required: true },
		member: [{ // Para hacer referencia al miembro que se va a calificar
			id: { type: String, required: true },
			quantity: { type: Number: required: true },
		}],
		quiz: [{
			field: [{
				question: { 
					title: { type: String, required: true },
					position: { type: Number }
				},
				open: { type: Boolean, required: true },
				answer: [{
					title: { type: String, required: true }
				}],
				openAnswer: { type: String },
				quantity: { type: Number }
			}]
		}],
		quantity: { type: Number },
		createdDate: { type: Date, required: true, default: new Date() },
	}]
	section: [{
		name: { type: String, required: true },
		subsection: [{
			name: { type: String, required: true },
		}]
	}]
});

module.exports = mongoose.model('Course', CourseSchema);