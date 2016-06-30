var express = require("express");
var logfmt = require("logfmt");
var mongoose   = require('mongoose');
var config = require("./config");
var User = require('./models/user');
var bodyParser = require('body-parser');
var app = express();
mongoose.connect(config.mongoUri);

app.use(logfmt.requestLogger());
app.use(bodyParser());


app.get('/', function(req, res) {
    res.json("Welcome to our payment API");
});


//##########################################################################################
//                                Payment
//##########################################################################################
app.post('/payment', function(req, res) {
    var payment = {
        "amount": req.body.amount,
        "description": req.body.description,
        "card": {
            "expMonth": user.expMonth,
            "expYear": user.expYear,
            "cvc": user.cardVeriCode,
            "number": user.creditCardNumber
        },
        "currency": req.body.currency
    };
    config.SimplifyPay.payment.create(payment, function (errData, data) {
        if (errData) {
            console.log(errData);
            console.log(data);
            res.json({code: "400", message: errData.data.error.fieldErrors})
            console.log(errData.data.error.fieldErrors);
            console.error("Error Message: " + errData.data.error.message);
            // handle the error
            return;
        }
        else{
            res.json({code: "200", message:"Payment Successful"})
        }
        console.log("Payment Status: " + data.paymentStatus);
    });
});
//##########################################################################################
//                                User Creation
//##########################################################################################
app.post('/user', function(req, res) {
    if (req.body.id) {
        // creation of user
        User.findById(req.body.id, function (err, user) {

            var user = new User();
            if (!req.body.email || !req.body.password || !req.body.fname || req.body.lname) {
                var error_message = {
                    code: '400',
                    message: 'You must have a valid email along with a password and name to create an account!'
                };
                res.send(error_message);
            } else {
                var user_exists = false;
                User.find({email: req.body.email}, function (err, users) {	// Check users in the DB for the same email
                    if (users.length > 0) {
                        res.json({code: '400', message: 'E-mail already exists!'});
                    } else {
                        user.name = req.body.name;
                        user.password = req.body.password;
                        user.email = req.body.email;
                        user.creditCardNumber = req.body.creditCardNumber;
                        user.expMonth = req.body.expMonth;
                        user.expYear = req.body.expYear;
                        user.cardVeriCode = req.body.cvc;


                        user.save(function (err) {
                            if (err) {
                                res.send(err);
                            }
                            res.json({code: "200", message: 'Account Created Successfully'});
                        });
                    }
                });
            }
        });
    }
});


app.get('/user', function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.send(err);
        }
        res.json(users);
    });
});

//##########################################################################################
//                                Login
//##########################################################################################
app.post('/login', function(req, res) {
    if (!req.body.password || !req.body.email) {
        res.json({code:"400", message:"Incorrect Email/Password"});
    } else {
        User.find({email:req.body.email}, function(err, users) {
            if (err) {
                res.json({code:"500", message:"Cannot connect to Database. Please try again later!"});
            } else {
                if (users.length == 1) {
                    if (req.body.password == users[0].password) {
                        res.json({code:"200", id:users[0]._id});
                    } else {
                        res.json({code:"401", message:"No user detected with those credentials"});
                    }
                }

            }
        });
    }
});

var port = Number(process.env.PORT || 4000);
app.listen(port, function() {
    console.log("Listening on " + port);
});
