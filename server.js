var io         = require('socket.io'),
    url        = require('url'),
    express    = require('express'),
    http       = require('http'),
    Simplify   = require("simplify-commerce"),
    path       = require('path'),
    bodyParser = require('body-parser'),
    open       = require('open');


var client = Simplify.getClient({
    publicKey: 'sbpb_YWIwNjQ0ZjktZjliZC00MjIxLWE4MjQtNjgwNzM1NzhiOTc1',
    privateKey: 'wh6zoPs2busqsi29yYModJ4jM2ZtJHnADPi4hsffEC15YFFQL0ODSXAOkNtXTToq'
});

var port = 4000;
var app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');


// This is the root page.
app.get('/', function(req, res){
    console.log('Rendering Website');
    res.render('paymentForm');
});


app.get('/publicKey', function(req, res){
    console.log('Get public key: '+ client.payment.appKeys.publicKey);
    res.send(client.payment.appKeys.publicKey);
});


// This exposes an endpoint for makePayment
app.post('/makePayment', function(req, res){
  console.log('Payment was called.');
  makePayment(req);
  res.redirect('http://localhost:4000');
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
    console.log("Payment Request: "+ req.params.toString());
    client.payment.create({
        amount : "1000",
        token : req.params.simplifyToken,
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
