// add http module and client
var http = require('http');
var express = require('express');
var request = require('request');
var settings = require('./settings');
var ua = require('universal-analytics');
var bodyParser = require('body-parser');
var urbanParser = require('./lib/urban-parser');
var commandParser = require('./lib/slack-command-parser');
var helper = require('./lib/helpPage');
var secrets = require('./secrets');

var mLabKey = (process.env.mLabApiKey ? process.env.mLabApiKey : secrets.mLabApiKey);

var mlab = require('mongolab-data-api')(mLabKey);

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
app.set('view engine', 'ejs');
app.set('views', __dirname+'/web/views');

//standard web homepage route
app.get('/', function(req, res){
  res.render('index');
});

//add to slack success route
app.get('/AddSlack', function(req, res){
  visitor.pageview("/AddSlack").send();

  if (req.query.error)
  {
    visitor.pageview("/AddSlack/Error").send();
    res.render('add-fail', { errorMessage: "Authorization Failed"});
  }
  else {
    visitor.pageview("/AddSlack/Success").send();
    //return code will be needed for registering with the team
    var code = req.query.code;
    //get ready to issue request to Urban API

    //look for secrets first in proc file, then in secrets js.

    var slack_client_ID = (process.env.secret_slack_client_ID ? process.env.secret_slack_client_ID : secrets.secret_slack_client_ID);
    var slack_client_secret = (process.env.secret_slack_client_secret ? process.env.secret_slack_client_secret : secrets.secret_slack_client_secret);

    var slack_authorization = settings.slackOAuthURI +
      '?client_id=' + slack_client_ID +
      '&client_secret=' + slack_client_secret +
      '&code=' + code +
      '&redirect_uri=' + settings.slackRedirectURI_heroku;

    //set urban api url;
    var options = {
      url: slack_authorization
    };
    //hit up urban dictionary API
    request(options, function callback (error, response, body){

      var bodyJson = JSON.parse(body);

      if (!(bodyJson.ok)){
        visitor.pageview("/AddSlack/Error").send();

        res.render('add-fail', {errorMessage : bodyJson.error});
      }
      else {
        res.render('add-success');
      }
    });

  }
});

//api route
app.post('/api', function(req, res){
  //google pageview tracking
  visitor.pageview("/api").send();

  //capture request details and prepare for Urban API request
  var req_command       = req.body.command;
  var req_text          = req.body.text;
  var req_team_id       = req.body.team_id;
  var req_team_domain   = req.body.team_domain;
  var req_channel_id    = req.body.channel_id;
  var req_channel_name  = req.body.channel_name;
  var req_user_id       = req.body.user_id;
  var req_user_name     = req.body.user_name;

  //parse command and look for switches
  var parsedCommand = commandParser.parse(req_text);


  //record current datetime
  var currentDate = new Date();

  //record requests in mLab
  var mlabOptions = {
    "database"        : settings.mongoDBName,
    "collectionName"  : "phrases",
    "documents"       : {
        "responseType"  : parsedCommand.responseType,
        "queryText"     : parsedCommand.Command,
        "filter"        : parsedCommand.rating,
        "datetime"      : currentDate,
        "team_id"       : req_team_id,
        "team_domain"   : req_team_domain,
        "cahnnel_id"    : req_channel_id,
        "channel_name"  : req_channel_name,
        "user_id"       : req_user_id,
        "user_name"     : req_user_name
        }
  };


  //if command is "?", just return the help page. no need to call urban API
  //sanitize whitespaces and see if all we have left is ?
  //should be able to post this publically and privately
  if (parsedCommand.Command.replace(/ /g,'') == '?'){
    res.send(helper.help(parsedCommand.responseType, req_command));
    mlabOptions.documents.result_type = "help";

    //now insert help data to mLab
    mlab.insertDocuments(mlabOptions, function(err, data){
      if(err){
        console.log(err);
      }
      else {
        //debug only
        //console.log("Mongo insert ok.");
      }
    });
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
        res.send(urbanParser.parse(body, parsedCommand.responseType, parsedCommand.rating));

      }
      else {
        console.error();
      }

      //record the result we got from UD API
      mlabOptions.documents.result_type = JSON.parse(body).result_type;

      //now insert response data to mLab
      mlab.insertDocuments(mlabOptions, function(err, data){
        if(err){
          console.log(err);
        }
        else {
          //debug only
          //console.log("Mongo insert ok.");
        }
      });
    });
  }
});


//start the server and listen on the designated port
var server = app.listen(process.env.PORT || PORT, function(){
  console.log("Server started at localhost:%s", PORT);
});
