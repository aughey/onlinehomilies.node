var express = require('express')
var app = express()
var AWS = require('aws-sdk');
var Q = require('q');

var bodyParser = require('body-parser')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));

var MongoClient = require('mongodb').MongoClient

Q.nfcall(MongoClient.connect, "mongodb://localhost/onlinehomilies").then((db) => {
    console.log("Connected to mongodb");
    app.get('/sessions', function(req, res) {
        db.collection('sessions').find({}).sort({date: -1}).limit(5).toArray().then(data => {
            res.send(data);
        });
    })
});

app.listen(3000);
console.log("Webserver Started");
