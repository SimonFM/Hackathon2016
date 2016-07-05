var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookingSchema = new Schema({
    name: String,
    email: String,
    phoneNumber: String,
    instructor: String,
    lessonCount: String,
    startDate: String,
    endDate: String,
    currency: String,
    costPL: String,
    creditCardNumber: String,
    expMonth: String,
    expYear: String,
    cardVeriCode: String
});

module.exports = mongoose.model('Booking', BookingSchema);