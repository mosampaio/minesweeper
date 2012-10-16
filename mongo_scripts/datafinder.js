var mongo = require('mongoskin');

  var conn = mongo.db('mongodb://minesweeper:1234@alex.mongohq.com:10076/minesweeper', {safe:true});
  conn.collection('sessions').find().toArray(function(err, items){
    if (err) { console.dir(err); }
    var usersConnected = [];
    for (var i in items) {
        var json = items[i].session;
        var session = JSON.parse(json);
        if (session.logged) usersConnected.push(session.email);
    }
    console.dir(usersConnected);
  });

console.log('Server running...');