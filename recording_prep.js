var Q = require('q');

var MongoClient = require('mongodb').MongoClient

Q.nfcall(MongoClient.connect, "mongodb://localhost/onlinehomilies").then((db) => {
    console.log("Connected to mongodb");
    var updates = []
    db.collection('sessions').find({}).forEach((s) => {
      var titles = s.recordings.map((r) => r.title);
      s.recording_titles = titles.join(' ');

    },() => {
      console.log("Done");
      db.close();
    });
}).done();

