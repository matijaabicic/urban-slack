// add http module and client
var http = require('http');
var express = require('express');
var request = require('request');
var settings = require('./settings');
var ua = require('universal-analytics');
var bodyParser = require('body-parser');
var urbanParser = require('./urban-parser');
var commandParser = require('./slack-command-parser');
//var callback = require('./callback');

//let the server port be configurable. it really doesn't matter since this
//is a listening port. Moubot v1 does not listen.
var PORT = settings.serverPort;

//initialize Google Analytics
var visitor = ua(settings.GA);

//initiate the express web app
var app = express();
app.use(express.static(__dirname + '/web'));
app.use(ua.middleware(settings.GA));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//api call that returns the infomation about the next match. this needs to
//be tidyed up.
app.post('/api', function(req, res){
  //google pageview tracking
  visitor.pageview("/api").send();
  //res.send('Api request received...');

  //capture request details and prepare for Urban API request
  global.response_url = req.body.response_url;
  var req_text = req.body.text;

  //parse command and look for switches
  var parsedCommand = commandParser.parse(req_text);

  console.log(parsedCommand);

  var urban_request = settings.urbanAPI + parsedCommand.Command;

  //set urban api url;
  var options = {
    url: urban_request
  };
  //hit up urban dictionary API
  request(options, function callback (error, response, body){
    if (!error && response.statusCode==200){

      //send the cleaned-up command and response type to parser
      res.send(urbanParser.parse(body, parsedCommand.responseType));

    }
    else {
      console.error();
    }
  });
});


//start the server and listen on the designated port
var server = app.listen(process.env.PORT || PORT, function(){
  console.log("Server started at localhost:%s", PORT);
});
