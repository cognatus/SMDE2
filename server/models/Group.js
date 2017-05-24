var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
	key: {type:String, required:true, unique: true},
	name: {type: String, required: true},
	level: {type: Number, required: true}
});

module.exports = mongoose.model('Group', GroupSchema);