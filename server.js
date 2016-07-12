var express = require("express");
var logfmt = require("logfmt");
var mongoose = require('mongoose');
var config = require("./config");
var User = require('./models/user');
var Merchant = require('./models/merchant');
var Booking = require('./models/booking');
var bodyParser = require('body-parser');
var Moment = require('moment');
var app = express();
mongoose.connect(config.mongoUri);

app.use(logfmt.requestLogger());
app.use(bodyParser());


app.get('/', function (req, res) {
    res.json("Welcome to our Booking API");
});

//##########################################################################################
//                                Payment
//##########################################################################################

app.post('/payment', function (req, res) {
    var payment = {
        "amount": req.body.amount,
        "description": req.body.description,
        "card": {
            "expMonth": "12",
            "expYear": "19",
            "cvc": "232",
            "number": "5555555555554444"
        },
        "currency": req.body.currency
    };
    config.SimplifyPay.payment.create(payment, function (errData, data) {
        if (errData) {
            console.log(errData);
            console.log(data);
            res.json({code: "400", message: errData.data.error.fieldErrors});
            console.log(errData.data.error.fieldErrors);
            console.error("Error Message: " + errData.data.error.message);
            // handle the error
            return;
        } else {
            res.json({code: "200", message: "Payment Successful"})
        }
        console.log("Payment Status: " + data.paymentStatus);
    });
});

//##########################################################################################
//                                User Creation
//##########################################################################################

// creation of user
app.post('/user', function (req, res) {
    var user = new User();
    if (!req.body.email || !req.body.password || !req.body.name) {
        var error_message = {
            code: '400',
            message: 'You must have a valid email along with a password and name to create an account!'
        };
        res.send(error_message);
    } else {
        User.find({email: req.body.email}, function (err, users) {	// Check users in the DB for the same email
            if (users.length > 0) {
                res.json({code: '400', message: 'E-mail already exists!'});
            } else {
                user.name = req.body.name;
                user.password = req.body.password;
                user.email = req.body.email;
                user.phoneNumber = req.body.phoneNumber;
                user.creditCardNumber = req.body.creditCardNumber;
                user.expMonth = req.body.expMonth;
                user.expYear = req.body.expYear;
                user.cardVeriCode = req.body.cvc;


                user.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({code: "200", message: 'User account created successfully'});
                });
            }
        });
    }
});

// creation of merchant
app.post('/merchant', function (req, res) {
    var merchant = new Merchant();
    if (!req.body.email || !req.body.password || !req.body.name) {
        var error_message = {
            code: '400',
            message: 'You must have a valid email along with a password and name to create an account!'
        };
        res.send(error_message);
    } else {
        Merchant.find({email: req.body.email}, function (err, merchants) {	// Check users in the DB for the same email
            if (merchants.length > 0) {
                res.json({code: '400', message: 'E-mail already exists!'});
            } else {
                merchant.name = req.body.name;
                merchant.password = req.body.password;
                merchant.email = req.body.email;
                merchant.creditCardNumber = req.body.creditCardNumber;
                merchant.expMonth = req.body.expMonth;
                merchant.expYear = req.body.expYear;
                merchant.cardVeriCode = req.body.cvc;

                merchant.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({code: "200", message: 'Merchant account created successfully'});
                });
                var a = Moment(new Date());
                var b = Moment(new Date());
                b.add(365, 'days');


                for (var m = Moment(a); m.isBefore(b); m.add(1, 'days')) {
                    var endTime = 21;
                    var tomorrow = Moment(m);
                    for( var i = 9; i < endTime; i = i + 1){
                        var booking = new Booking();
                        booking.name = "EMPTY";
                        booking.email = null;
                        booking.merchant = req.body.name;
                        booking.lessonCount = null;
                        booking.startDate = a.format('LL');
                        booking.endDate = tomorrow.format('LL');
                        booking.startHour = i;
                        booking.endHour = i+1;
                        booking.ref = null;
                        booking.save();
                    }

                }
            }
        });
    }
});

//##########################################################################################
//                                Get Users
//##########################################################################################

//get all users in db
app.get('/user', function (req, res) {
    User.find(function (err, users) {
        if (err) {
            res.send(err);
        }
        res.json(users);
    });
});

//get a single user in db
app.post('/singleUser', function (req, res) {
    User.find({email: req.body.email}, function (err, user) {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
});

//get all merchants in db
app.get('/merchant', function (req, res) {
    Merchant.find(function (err, merchants) {
        if (err) {
            res.send(err);
        }
        res.json(merchants);
    });
});

//##########################################################################################
//                                Login
//##########################################################################################

//user login
app.post('/login', function (req, res) {
    if (!req.body.password || !req.body.email) {
        res.json({code: "400", message: "You must have a valid email and password"});
    } else {
            User.find({email: req.body.email}, function (err, users) {
                if (err) {
                    res.json({code: "502", message: "Cannot connect to the database!"});
                } else {
                    if (users.length == 1) {
                        //successful login response
                        if (req.body.password == users[0].password) {
                            res.json({Type: "User", message: "Welcome back " + users[0].name});
                        } else {
                            res.json({code: "401", message: "Not allowed!"});
                        }
                    }
                    //Handle no response
                    else {
                        res.json({message: "No account found with those credentials!"});
                    }

                }
            });

        }
});
//merchant login
app.post('/merchantLogin', function (req, res) {
    if (!req.body.password || !req.body.email) {
        res.json({code: "400", message: "You must have a valid email and password"});
    } else {
        Merchant.find({email: req.body.email}, function (err, merchants) {
            if (err) {
                res.json({code: "502", message: "Cannot connect to the database!"});
            } else {
                if (merchants.length == 1) {
                    //successful login response
                    if (req.body.password == merchants[0].password) {
                        res.sendfile('Merchant/success.html');
                        console.log({message: "No account found with those credentials!"});

                    } else {
                        res.json({code: "401", message: "Not allowed!"});
                    }
                }
                //Handle no response
                else {
                    res.json({message: "No account found with those credentials!"});
                }

            }
        });

    }
});
//##########################################################################################
//                               Create Booking
//##########################################################################################

app.post('/booking', function (req, res) {
    var booking = new Booking();

    booking.name = req.body.name;
    booking.email = req.body.email;
    booking.merchant = req.body.merchant;
    booking.lessonCount = req.body.lessonCount;
    booking.startDate = req.body.startDate;
    booking.endDate = req.body.endDate;
    booking.startHour = req.body.startHour;
    booking.endHour = req.body.endHour;
    booking.currency = req.body.currency;
    booking.creditCardNumber = req.body.creditCardNumber;
    booking.expMonth = req.body.expMonth;
    booking.expYear = req.body.expYear;
    booking.cardVeriCode = req.body.cvc;
    booking.ref = req.body.merchant + "-" + req.body.startDate + "-" + req.body.endDate +"-"+ req.body.startHour +"-"+ req.body.endHour;

    Booking.find({ref: booking.ref}, function (err, bookings) {
        if (bookings.length > 0) {
            res.json({message: 'This booking is unavailable at this current time!'});
        } else {
            booking.save(function (err) {
                if (err) {
                    res.send(err);
                }

                res.json({
                    code: "200",
                    message: "Your booking with " + req.body.merchant + " has been confirmed and will commence on: "
                    + req.body.startDate + " At "+req.body.startHour +" and finish on: " + req.body.endDate + " At "+req.body.endHour
                });
            });
        }
    });
});

//##########################################################################################
//                                Get Bookings
//##########################################################################################

//get all active bookings in the db
app.get('/booking', function (req, res) {
    Booking.find().where('ref').ne(null).exec(function (err, bookings) {
        if (err) {
            res.send(err);
        }
        res.json(bookings);
    });
});

//get all active bookings for particular merchant
app.post('/merchantBooking', function (req, res) {
    var booking = new Booking();
    booking.merchant = req.body.merchant;
    Booking.find({merchant: booking.merchant}).where('ref').ne(null).exec(function (err, bookings){
        if(bookings.length > 0 ){
            res.json(bookings);
        } else{
            res.json({message: 'There are no bookings at present for this merchant!'});
        }
    });
});

//get all active bookings for particular merchant
app.post('/userBookings', function (req, res) {
    Booking.find({email: req.body.email}).where('ref').ne(null).exec(function (err, bookings){
        if(bookings.length > 0 ){
            res.json(bookings);
        } else{
            res.json({message: 'There are no bookings at present for this user!'});
        }
    });
});

//get all empty bookings for particular merchant
app.post('/merchantEmptyBooking', function (req, res) {
    var booking = new Booking();

    booking.merchant = req.body.merchant;
    Booking.find({merchant: booking.merchant}).where('ref').equals(null).exec(function (err, bookings){
        if(bookings.length > 0 ){
            res.json(bookings);
        } else{
            res.json({message: 'There are no bookings at present for this merchant!'});
        }
    });
});

//get all empty bookings by date for particular merchant
app.post('/searchEmptyBooking', function (req, res) {
    var booking = new Booking();

    booking.merchant = req.body.merchant;
    booking.date = req.body.date;
    Booking.find({merchant: booking.merchant,endDate: booking.date}).where('ref').equals(null).exec(function (err, bookings){
        if(bookings.length > 0 ){
            res.json(bookings);
        } else{
            res.json({message: 'There are no bookings on: '+req.body.date+' currently available!'});
        }
    });
});
//##########################################################################################
//                                Server Port Config
//##########################################################################################

var port = Number(process.env.PORT || 4000);
app.listen(port, function () {
    console.log("Listening on " + port);
});
