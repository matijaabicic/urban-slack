// add http module and client
var http = require('http');
var express = require('express');
var request = require('request');
var settings = require('./settings');
var ua = require('universal-analytics');
var bodyParser = require('body-parser');
var urbanParser = require('./urban-parser');
var commandParser = require('./slack-command-parser');
var helper = require('./helpPage');
//var callback = require('./callback');

//let the server port be configurable.
var PORT = settings.serverPort;

//initialize Google Analytics
var visitor = ua(settings.GA);

//initiate the express web app
var app = express();
app.use(express.static(__dirname + '/web'));
app.use(ua.middleware(settings.GA));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//add to slack success route
app.get('/AddSlack', function(req, res){
  visitor.pageview("/AddSlack").send();

  console.log(req.query);
  console.log(res);

  if (req.query.error)
  {
    visitor.pageview("/AddSlack/Error").send();
    res.sendFile('add-fail.html', {"root": __dirname + '/web' });
  }
  else {
    visitor.pageview("/AddSlack/Success").send();
    res.sendFile('add-success.html', {"root": __dirname + '/web' });
  }
});

//api route
app.post('/api', function(req, res){
  //google pageview tracking
  visitor.pageview("/api").send();
  //res.send('Api request received...');

  //capture request details and prepare for Urban API request
  var req_command = req.body.command;
  var req_text = req.body.text;

  //parse command and look for switches
  var parsedCommand = commandParser.parse(req_text);

  //if command is "?", just return the help page. no need to call urban API
  //sanitize whitespaces and see if all we have left is ?
  //should be able to post this publically and privately
  if (parsedCommand.Command.replace(/ /g,'') == '?'){
    res.send(helper.help(parsedCommand.responseType, req_command));
  }
  //otherwise, we have a real request.
  else{
    //get ready to issue request to Urban API
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
  }
});


//start the server and listen on the designated port
var server = app.listen(process.env.PORT || PORT, function(){
  console.log("Server started at localhost:%s", PORT);
});
