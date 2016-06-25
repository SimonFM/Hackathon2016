// imports
var io         = require('socket.io'),
    url        = require('url'),
    express    = require('express'),
    http       = require('http'),
    Simplify   = require("simplify-commerce"),
    path       = require('path'),
    bodyParser = require('body-parser'),
    open       = require('open');

//##########################################################################################
//                                Set up code
//##########################################################################################
var client = Simplify.getClient({
    publicKey: 'sbpb_YWIwNjQ0ZjktZjliZC00MjIxLWE4MjQtNjgwNzM1NzhiOTc1',
    privateKey: 'wh6zoPs2busqsi29yYModJ4jM2ZtJHnADPi4hsffEC15YFFQL0ODSXAOkNtXTToq'
});

var port = 4000;
var home = 'http://localhost:4000';
var app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

//##########################################################################################
//                                Handle Get Requests
//##########################################################################################
// This is the root page.
app.get('/', function(req, res){
    console.log('Rendering Website');
    res.render('paymentForm');
});


app.get('/publicKey', function(req, res){
    console.log('Get public key: '+ client.payment.appKeys.publicKey);
    res.send(client.payment.appKeys.publicKey);
    console.log('API key was sent.');

});

//##########################################################################################
//                                Handle POST Requests
//##########################################################################################

// This exposes an endpoint for makePayment
app.post('/makePayment', function(req, res){
  console.log('Payment was called.');
  makePayment(req);
  //res.redirect(home);
});

app.post('/makePlan', function(req, res){
    console.log('Plan was called.');
    makePlan(req);
    //res.redirect(home);
});

app.listen(port);
console.log('Running on localhost:'+ port + ' now ' + Date.now());
open('localhost:'+ port, 'firefox', function (err) {
    if (err) throw err;
    console.log('The user closed the browser');
});



//##############################################################################
//                               Simplify API code
//##############################################################################

// Makes a payment
function makePayment(req){
    console.log("Payment Request: ");
    console.log(req.body);
    client.payment.create({
        amount : "1000",
        token : req.body.simplifyToken,
        description : "This is our test payment",
        reference : 'TEST_PAYMENT_HACKATHON_2016',
        currency : "USD"
    }, function(errData, data){
        if(errData){
            console.error("Error Message: " + errData.data.error.message);
            return;
        }
        console.log("Payment Status: " + data.paymentStatus);
    });

}

//creates a subscription plan
function makePlan(request){
    console.log('make plan');
    client.plan.create({
        amount : request.body.amount,
        renewalReminderLeadDays : request.body.renewalReminderLeadDays,
        name : request.body.name,
        billingCycle : request.body.billingCycle,
        frequency : request.body.frequency,
        billingCycleLimit : request.body.billingCycleLimit ,
        frequencyPeriod : request.body.frequencyPeriod
    }, function(errData, data){
        if(errData){
            console.error("Error Message: " + errData.data.error.message);
            // handle the error
            return;
        }
        console.log("Success Response: " + JSON.stringify(data));
    });
}

function makeUserWithPlan(){
    client.customer.create({
        subscriptions : [{
                plan : "[PLAN ID]"
            }
        ],
        email : "customer@mastercard.com",
        name : "Customer Customer",
        card : {
            expMonth : "11",
            expYear : "19",
            cvc : "123",
            number : "5555555555554444"
        },
        reference : "Ref1"
    }, function(errData, data){
        if(errData){
            console.error("Error Message: " + errData.data.error.message);
            // handle the error
            return;
        }
        console.log("Success Response: " + JSON.stringify(data));
    });
}
