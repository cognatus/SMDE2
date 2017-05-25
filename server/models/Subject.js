var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubjectSchema = new Schema({
	key: {type:String, required:true},
	name: {type: String, required: true},
	level: {type: Number, required: true},
	area: String
});

module.exports = mongoose.model('Subject', SubjectSchema);