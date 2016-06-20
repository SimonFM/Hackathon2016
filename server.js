var io      = require('socket.io'),
    url     = require('url'),
    sys     = require('sys'),
    express = require('express'),
    http    = require('http'),
    path    = require('path');


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
sys.puts('server running ' + 'now ' + Date.now());
