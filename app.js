var express = require('express')
var app = express()
var AWS = require('aws-sdk');


var bodyParser = require('body-parser')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));

app.post('/sendmail', function (req, res) {
  res.send('POST request to the homepage')
})

app.listen(8000);
