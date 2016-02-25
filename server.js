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
  res.send('Next Chelsea match is ' + (global.nextMatch || 'not scheduled') + '.');
});

//early slack api. only knows how to respond with the time left until the next match
app.get('/api/slack', function(req, res){
  var originHost = req.headers.host;

  //exclude local api requests from Google Analytics tracking
  if(settings.gaIgnoreHosts.indexOf(req.header.host)!=-1){
    console.log('tracking request in analytics.');
    visitor.pageview("/api/slack").send();
  }

  //construc the response
  var jsonResponse = {};
  jsonResponse.text = 'Next Chelsea match is ' + (global.nextMatch || 'not scheduled' + '.');
  jsonResponse.nextMatchDate = global.nextMatch;
  jsonResponse.nextOpponent = global.nextOpponent;
  jsonResponse.lastPhrase = global.lastPhrase;
  jsonResponse.lastServerStart = global.lastServerStart;
  //console.log(req);
  res.send(jsonResponse);
});

//let's define options for our recurrent http request
var options = {
  url: tokens.resultsEndpoint,
  headers: {
    'X-Auth-Token' : process.env.resultsToken
  }
};


var server = app.listen(process.env.PORT || PORT, function(){
  console.log("Server started at localhost:%s", PORT);
  global.lastServerStart = new Date();

  //keep a track of last matchday commented, to avoid duplicates.
  //this needs refactoring
  global.lastPreMatchComment = null;
  global.lastPostMatchComment = null;

  //set up a timer.
  setInterval(function(){
    console.log("Tick...next match is " + (nextMatch || "not scheduled."));
    request(options, callback.callback);
  }, settings.pingInteralInMilliseconds);
});
