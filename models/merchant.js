/**
 * Created by simonmarkham on 04/07/2016.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MerchantSchema   = new Schema({
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

module.exports = mongoose.model('Merchant', MerchantSchema);