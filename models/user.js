// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    fname: String,
    lname: String, 
    email: String,
    password: String, 
    creditCardNumber: String, 
    expiryMonth: String, 
    expiryYear: String, 
    cardSecurityCode: String 
});

module.exports = mongoose.model('User', UserSchema);