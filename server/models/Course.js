var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
	subject : {
		id: {type: String, required: true}
		key: {type: String, required:true, unique: true},
		name: {type: String, required: true},
		level: {type: Number, required: true},
		area: String
	}, 
	group : {
		id: {type: String, required: true}
		key: {type: String, required:true, unique: true},
		name: {type: String, required: true},
		level: {type: Number, required: true}
	}
});

module.exports = mongoose.model('Course', CourseSchema);