var express = require("express");
var logfmt = require("logfmt");
var mongoose = require('mongoose');
var config = require("./config");
var User = require('./models/user');
var Merchant = require('./models/merchant');
var Booking = require('./models/booking');
var bodyParser = require('body-parser');
var app = express();
mongoose.connect(config.mongoUri);

app.use(logfmt.requestLogger());
app.use(bodyParser());


app.get('/', function (req, res) {
    res.json("Welcome to our payment API");
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
        }
        else {
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
                var i = 0;
                var start = new Date();
                var endDateAsString = start.getDate()+"/"+ start.getMonth()+"/"+(start.getFullYear()+1);
                var end = new Date(endDateAsString);

                while(start < end){
                    var newDate = start.setDate(start.getDate() + 1);
                    start = new Date(newDate);
                    var startHour = 9;
                    var endHour = startHour + 1;

                    while(startHour < 21){
                        var booking = new Booking();
                        booking.name = "EMPTY";
                        booking.email = "EMPTY";
                        booking.instructor = req.body.name;
                        booking.lessonCount = "EMPTY";
                        booking.startDate = newDate;
                        booking.endDate = start;
                        booking.startHour = startHour;
                        booking.endHour = endHour;
                        booking.ref = "EMPTY";
                        booking.save();
                        startHour = startHour + 1;
                        endHour = startHour + 1;
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

app.post('/login', function (req, res) {
    if (!req.body.password || !req.body.email) {
        res.json({code: "400", message: "You must have a valid email and password"});
    } else {
        console.log(req.body);

        Merchant.find({email: req.body.email}, function (err, merchants) {
                if (err) {
                    res.json({code: "502", message: "Cannot connect to the database!"});
                } else {
                    if (merchants.length == 1) {
                        //successful login response
                        if (req.body.password == merchants[0].password) {
                            res.json({code: "200", message: "Welcome back " + merchants[0].name});
                        } else {
                            res.json({code: "401", message: "Not allowed!"});
                        }
                    }
                    //Handle no response
                    else {
                        User.find({email: req.body.email}, function (err, users) {
                            if (err) {
                                res.json({code: "502", message: "Cannot connect to the database!"});
                            } else {
                                if (users.length == 1) {
                                    //successful login response
                                    if (req.body.password == users[0].password) {
                                        res.json({code: "200", message: "Welcome back " + users[0].name});
                                    } else {
                                        res.json({code: "401", message: "Not allowed!"});
                                    }
                                }
                                //Handle no response
                                else {
                                    res.json({message:"No account found with those credentials!"});
                                }

                            }});


                    }
                }

            }
        );
    }
});
//##########################################################################################
//                               Create Booking
//##########################################################################################

app.post('/booking', function (req, res) {
    var booking = new Booking();

    booking.name = req.body.name;
    booking.email = req.body.email;
    booking.instructor = req.body.instructor;
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
    booking.ref = req.body.instructor + "-" + req.body.startDate + "-" + req.body.endDate +"-"+ req.body.startTime +"-"+ req.body.endTime;

    Booking.find({ref: booking.ref}, function (err, bookings) {
        if (bookings.length > 0) {
            res.json({message: 'This booking is unavailable at this current time!'});
        }

        else {
            booking.save(function (err) {
                if (err) {
                    res.send(err);
                }

                res.json({
                    code: "200",
                    message: "Your booking with " + req.body.instructor + " has been confirmed and will commence on: " + req.body.startDate + " At "+req.body.startTime
                    +" and finish on: " + req.body.endDate + " At "+req.body.endTime
                });
            });
        }
    });
});

//##########################################################################################
//                                Get Bookings
//##########################################################################################

//get all bookings in the db
app.get('/booking', function (req, res) {
    Booking.find(function (err, bookings) {
        if (err) {
            res.send(err);
        }
        res.json(bookings);
    });
});

//##########################################################################################
//                                Server Port Config
//##########################################################################################

var port = Number(process.env.PORT || 4000);
app.listen(port, function () {
    console.log("Listening on " + port);
});
