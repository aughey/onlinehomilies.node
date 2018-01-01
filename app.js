var express = require('express')
var app = express()
var AWS = require('aws-sdk');
var Q = require('q');
var Podcast = require('podcast')

var bodyParser = require('body-parser')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

var mongo = require('mongodb')
var MongoClient = mongo.MongoClient

var baseurl='http://aughey.washucsc.org/'
var baseurl='http://www.onlinehomilies.com/'

Q.nfcall(MongoClient.connect, "mongodb://localhost/onlinehomilies").then((db) => {
    console.log("Connected to mongodb");
    //db.collection('sessions').createIndex({recording_titles:'text'}).then(() => {
    //  console.log("Created indices for title");
    //});

    
    function dopodcast(req, res) {
      var feed = new Podcast({
        title: "Catholic Student Center at Washington University",
	description: "Weekly Homilies",
	feed_url: baseurl + "api/podcast",
	site_url: baseurl,
	language: 'en',
	itunesOwner: { name: "John Aughey", email: 'jha@aughey.com' },
	//image_url: "http://www.washucsc.org/wp-content/uploads/2015/07/CSC-Logo-whiteFINAL.png",
	image_url: baseurl + "csc-house.jpg",
	itunesCategory: [ { text: "Religion & Spirituality" } ],
	itunesAuthor: "Catholic Student Center at Washington University"
      });

      var query = db.collection('sessions').find({}).sort({date: -1})
      query.limit(10);
      query.toArray().then((sessions) => {
      sessions.forEach((s) => {
        return s.recordings.forEach((r) => {
	  var url = 'http://s3.amazonaws.com/onlinehomilies_audios/' + r.oh_id + ".mp3";
	  feed.item({
	    title: r.title,
	    description: s.title,
	    url: url,
	    guid: r.oh_id.toString(),
	    date: s.date,
	    itunesCategory: [ { text: "Religion & Spirituality" } ],
	    categories: ['Spirituality','Religion & Spirituality','Christianity'],
	    itunesAuthor: r.speaker,
	    enclosure: {
	      url: url
	    }
	  });
	});
      })
      res.set('Content-Type','text/xml');
      res.send(feed.xml(' '))
      })

    }
    app.get('/podcast', dopodcast);
    app.get('/feed', dopodcast);

    app.get('/sessions', function(req, res) {
    //console.log(req.query);
        var query = null;
	var page = 1;
	if(req.query.page) {
	  page = parseInt(req.query.page);
	}
	if(page < 1) {
	page = 1;
	}
        if(req.query.q && req.query.q !== "") {
	  //console.log("Doing text query: " + req.query.q);
	  query = db.collection('sessions').find(
	  {'$text' : {'$search' : req.query.q } },
	  { score: {'$meta' : 'textScore'} }
	  ).sort({date: -1})
	  //).sort({score:{'$meta':'textScore'}})
	} else if(req.query.id) {
	  id = new mongo.ObjectID(req.query.id)
          query = db.collection('sessions').find({_id: id})
	} else {
          query = db.collection('sessions').find({}).sort({date: -1})
	}
	if(req.query.limit) {
	  var limit = parseInt(req.query.limit,10);
	  if(limit > 10) {
	    limit = 10;
	  }
	  if(limit < 1) {
	    limit = 1;
	  }
	} else {
  	  var limit = 10;
	}
	query.limit(limit);
	query.skip((page-1) * limit);
	var count = null
	query.count().then((c) => {
	  count = c;
	  //console.log("Count: " + c);
	}).then(() => {
          return query.toArray()
	}).then(data => {
            res.send({
	    limit: limit,
	    page: page,
	    count: count,
	    sessions: data
	    });
        });
    })
}).done();

app.listen(4001, function() {
console.log("Webserver Started");
});
