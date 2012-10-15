var cookie = require('cookie');
var express = require('express');
var http = require('http');
var app = express();
var MongoStore = require('connect-mongo')(express);
var mongo = require('mongoskin');
var conn = mongo.db('mongodb://minesweeper:1234@alex.mongohq.com:10076/minesweeper', {safe:true});
var server = http.createServer(app);
var io = require('socket.io').listen(server);
//var store = new express.session.MemoryStore({reapInterval: 60000 * 10});
var conf = {
  db: {
    db: 'minesweeper',
    host: 'alex.mongohq.com',
    port: 10076,
    username: 'minesweeper', // optional
    password: '1234', // optional
    collection: 'sessions' // optional, default: sessions
  },
  secret: 'foobar'
};
var store = new MongoStore(conf.db)
server.listen(process.env.PORT, process.env.IP);


app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({store: store, secret:'foobar', key: 'express.sid', maxAge: new Date(Date.now() + 3600000)}));
app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res){
    console.log('email : ' + req.session.email);
    if (req.session.logged) {
      res.sendfile(__dirname + '/public/home.html');
    } else {
      res.sendfile(__dirname + '/public/login.html');
    }
});

app.post('/login/', function(req, res){
    conn.collection('user').findOne({email: req.param('email', null)}, function(err, item){
        if (err) res.sendfile(__dirname + '/public/login.html');
        
        req.session.email = req.param('email', null);
        req.session.logged = true;
        res.redirect('http://minesweeper.mosampaio.c9.io/');
    });
    
});

app.get('/users/connected/', function(req, res){
    conn.collection('sessions').find().toArray(function(err, items){
        if (err) { console.dir(err); }
        var usersConnected = [];
        for (var i in items) {
            var session = JSON.parse(items[i].session);
            if (session.logged) usersConnected.push(session.email);
        }
        var users = {usersConnected: usersConnected};
        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        res.write(JSON.stringify(users));
        res.end();
    });
    

});


io.set('authorization', function (data, accept) {
  if (data.headers.cookie) {
    // Whatever you put in the data object will be available in socket.handshake later on in connection event handler
    data.cookie = cookie.parse(data.headers.cookie);
    data.sessionID = data.cookie['express.sid'].substring(2, 26);
    //console.dir(data);
    accept(null, true);
  } else {
    accept('No cookie transmitted.', false);
  }
});

io.sockets.on('connection', function (socket) {
  var sid = socket.handshake.sessionID;
  console.log('A socket with sessionID ' + sid + ' connected!');
  store.get(sid, function(error, session) {
      socket.broadcast.emit('message', {type: 'broadcast', email: session.email});
  });
  
  socket.on('message', function() { 
      console.log('###store get sid : ' + sid); 
      store.get(sid, function(error, session) {
        console.log(session);
      });
      
      
  });
  socket.on('disconnect', function () { console.log('disconnected'); });
});