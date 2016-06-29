var express = require("express");
var logfmt = require("logfmt");
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var config = require("./config");


var request = require('request');

app.use(bodyParser());
app.get('/', function(req, res) {
    res.json("Welcome to our payment API");
});

app.post('/payment', function(req, res) {
    var payment = {
        "amount": req.body.amount,
        "description": "Test Payment",
        "card": {
            "expMonth": req.body.card.expMonth,
            "expYear": req.body.card.expYear,
            "cvc": req.body.card.cvc,
            "number": req.body.card.number
        },
        "currency": "USD"
    };
    config.SimplifyPay.payment.create(payment, function (errData, data) {
        if (errData) {
            console.log(errData);
            console.log(data);
            res.json({code: "0006", message: errData.data.error.fieldErrors})
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

    //res.json({code: "0006", message: "heya"});
});



var port = Number(process.env.PORT || 4000);
app.listen(port, function() {
    console.log("Listening on " + port);
});