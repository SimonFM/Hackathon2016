var io      = require('socket.io'),
    url     = require('url'),
    sys     = require('util'),
    express = require('express'),
    http    = require('http'),
    path    = require('path'),
    assert    = require('assert'),
    MongoClient = require('mongodb');

var mongoURL = 'mongodb://localhost:4001/test'

var app = express();
app.use(express.static(path.join(__dirname, '/public')));

var server = http.createServer(app);
var socket = io.listen(server);

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render('index');
});

app.listen(4000);
console.log('server running ' + 'now ' + Date.now());

var testUser = {name: 'Niall', age: 42, roles: ['admin', 'moderator', 'user']};

//addUser(testUser);

//findUser('Niall');

// Inserts the given user in to the database
//
//
function addUser(user){
  MongoClient.connect(mongoURL, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', mongoURL);

    // Get the documents collection
    var collection = db.collection('users');

    // Insert some users
    collection.insert([user], function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
      //Close connection
      db.close();
    });
  }
});
}

// Takes the name of the user we want to find in the database and then returns
// that user
//
function findUser(user){
  // Use connect method to connect to the Server
  MongoClient.connect(mongoURL, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', mongoURL);

      // Get the documents collection
      var collection = db.collection('users');

      // Insert some users
      collection.find({name: user}).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else if (result.length) {
          console.log('Found:', result);
        } else {
          console.log('No document(s) found with defined "find" criteria!');
        }
        //Close connection
        db.close();
      });
    }
  });
}
