var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
	subject : {
		key: {type: String, required:true},
		name: {type: String, required: true},
		level: {type: Number, required: true},
		area: String
	}, 
	group : {
		key: {type: String, required:true},
		name: {type: String, required: true},
		level: {type: Number, required: true}
	}
}, {
	unique: true
});

module.exports = mongoose.model('Course', CourseSchema);