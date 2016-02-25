// add http module and client
var http = require('http');
var express = require('express');
var request = require('request');
var callback = require('./callback');
var settings = require('./settings');
var ua = require('universal-analytics');

//let the server port be configurable. it really doesn't matter since this
//is a listening port. Moubot v1 does not listen.
var PORT = settings.serverPort;

//initialize Google Analytics
var visitor = ua(settings.GA);

//initiate the express web app
var app = express();
app.use(express.static(__dirname + '/web'));
app.use(ua.middleware(settings.GA));


//api call that returns the infomation about the next match. this needs to
//be tidyed up.
app.get('/api', function(req, res){
  //google pageview tracking
  visitor.pageview("/api").send();
  res.send('Api request received...');
});


//start the server and listen on the designated port
var server = app.listen(process.env.PORT || PORT, function(){
  console.log("Server started at localhost:%s", PORT);
});
