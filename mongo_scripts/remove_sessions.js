var mongo = require('mongoskin');

  var conn = mongo.db('mongodb://minesweeper:1234@alex.mongohq.com:10076/minesweeper', {safe:false});
  conn.collection('sessions').find().toArray(function(err, items){
      
    //  console.dir(items);
    if (err) { console.dir(err); }
    var usersConnected = [];
    for (var i in items) {
        var json = items[i].session;
        var session = JSON.parse(json);
        if (session.logged) usersConnected.push(items[i]._id);
        
        conn.collection('sessions').remove({_id: items[i]._id});
    }
    console.dir(usersConnected);
    
  });
  
  

console.log('Server running...');