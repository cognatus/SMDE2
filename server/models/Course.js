var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
	tags: { type: [String] },
	createdDate: { type: Date, required: true, default: new Date() },
	updatedDate: { type: Date, default: new Date() },
	isPrivate: { type: Boolean, required: true, default: false },
	user: {
		id: { type: String, required: true },
		name: { type: String, required: true },
		lastName: { type: String, required: true },
		nick: { type: String },
		mail: { type: String, required: true },
		profilePhoto: { type: String },
		backPhoto: { type: String }
	},
	groups: [{
		name: { type: String, required: true },
	}],
	members: [{
		id: { type: String, required: true },
		group: { type: String }
	}],
	activities: [{
		title: { type: String, required: true },
		member: [{ // Para hacer referencia al miembro que se va a calificar
			id: { type: String, required: true },
			qualification: { type: Number, required: true },
		}],
		quiz: [{
			field: [{
				question: {
					title: { type: String, required: true },
					position: { type: Number }
				},
				answers: [{
					title: { type: String, required: true }
				}],
				openAnswer: { type: String },
				quantity: { type: Number } // value/100
			}],
		}],
		quantity: { type: Number }, // value/100
		createdDate: { type: Date, required: true, default: new Date() },
		updatedDate: { type: Date, default: new Date() }
	}],
	section: [{
		name: { type: String, required: true },
		content: { type: String },
		subsection: [{
			name: { type: String, required: true },
			content: { type: String, required: true },
			createdDate: { type: String, required: true, default: new Date() },
			updatedDate: { type: String, required: true, default: new Date() },
		}],
		files: [{
			name: { type: String, required: true },
			uploadedDate: { type: Date, required: true, default: new Date() },
		}],
		createdDate: { type: Date, required: true, default: new Date() },
		updatedDate: { type: Date, required: true, default: new Date() },
	}]
});

module.exports = mongoose.model('Course', CourseSchema);