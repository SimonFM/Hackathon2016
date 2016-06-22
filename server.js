//Base setup 

//call packages 
var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var user = require('./models/user');
var mogoose = require('mongoose');
//configuring database
mongoose.connect(config.mongoUri); 

//configure app to use body-parser getting data from post 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

var port = process.env.PORT || 4000; //set the port 

//Routes for the API 

var router = express.Router(); //get an instance of express router 

//test route 
router.get('/', function(req,res){ 
	res.json({ message: 'hooray! welcome to our api!'}); 
});



//More routes if any 

app.use('/api', router);


app.post('/user', function(req, res) {
	if(req.body.id) { 

// creation of user
		var user = new user();
		if (!req.body.email || !req.body.password || !req.body.fname || req.body.lname) {
			var error_message = {code: '2002', message: 'Please enter additional user information!'};
			res.send(error_message);
		} else {
			var user_exists = false;
			user.find({email: req.body.email}, function(err, users) {	// Checks DB for users with this email 
				if (users.length > 0) {
					res.json({code: '2003', message: 'This E-mail is already in use!!'});
				} else {
					user.fname = req.body.fname;
					user.lname = req.body.lname;
					user.password = req.body.password;
					user.email = req.body.email;

					user.save(function(err) {
						if (err) {
							res.send(err);
						}
						res.json({ code: "200", message: 'Account created successfully!!' });
					});
				}

			});
		}
		
} else { 

//Update User
		User.findById(req.body.id, function(err, user) {
			if (err) {
				res.send(err);
			} else {
				// only rewrite new values
				if (req.body.fname) {
					user.fname = req.body.fname;
				}
				if (req.body.lname) {
					user.lname = req.body.lname;
				}
				if (req.body.password){
					user.password = req.body.password;
				}
				if (req.body.creditCardNumber) {
					user.creditCardNumber = req.body.creditCardNumber;
					// strip spaces or any non number characters
					user.expiryMonth = req.body.expiryMonth;	
					user.expiryYear = req.body.expiryYear;
					user.cardSecurityCode = req.body.cardSecurityCode;
				}
			}

		});
				
	}
});


//start server 

app.listen(port); 
console.log('magic happens on port' + port); 