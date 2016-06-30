var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	fname: String,
	lname: String,
	email: String,
	password: String,
	address: String,
	creditCardNumber: String,
	expMonth: String,
	expYear: String,
	cardVeriCode: String,
});

module.exports = mongoose.model('User', UserSchema);