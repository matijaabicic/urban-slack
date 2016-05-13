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
var mLabHelper = require('./lib/mLabHelper');

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
var lastPhrase = null;

//standard web homepage route
app.get('/', function(req, res){
  res.render('index', {latestQuery: lastPhrase});
});

//privacy route
app.get('/privacy', function(req, res){
  res.render('privacy');
});

//howto route
app.get('/howto', function(req,res){
  res.render('howto');
});

//cretids route
app.get('/contributors', function(req,res){
  //request data from github.
  var gh_request_options = {
    uri:   'https://api.github.com/repos/matijaabicic/urban-slack/contributors',
    method: 'GET',
    headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
  };

  request(gh_request_options, function callback (error, response, body){
    if(!error && response.statusCode==200)
    {

        //pass data to contributors page.
        res.render('contributors', {contributors: JSON.parse(body)});
    }
    else{
      console.log("Failed request to github.");
      console.log(error);
      //glitch with github. No data to pass, catch this scenario in contributors.ejs
      res.render('contributors', {contributors: []});
    }
  });

});

// history route added in v0.5.1
app.get('/history', function(req,res){
  //request data from github.
  var gh_request_options = {
    uri:   'https://api.github.com/repos/matijaabicic/urban-slack/releases',
    method: 'GET',
    headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
  };

  request(gh_request_options, function callback(error, response, body){
    if (!error && response.statusCode==200){
      //pass data to history page
      res.render('history', {releases : JSON.parse(body)});
    }
    else {
      console.log("Failed request to github.");
      console.log(error);
      //glitch with github. no data to pass, catch this scenario in history.ejs
      res.render('history',{releases : []});
    }
  });

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
        "queryText"     : (parsedCommand.last ? mLabHelper.GetLastQueryForUser(req_team_id, req_user_id) : parsedCommand.Command),
        "filter"        : parsedCommand.rating,
        "random"        : parsedCommand.random,
        "last"          : parsedCommand.last,
        "more"          : parsedCommand.more,
        "datetime"      : currentDate,
        "team_id"       : req_team_id,
        "cahnnel_id"    : req_channel_id,
        "user_id"       : req_user_id,
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
    //if requesting last, we need to fetch it from the DB first
    //this can be moved to in-memory later
    //get ready to issue request to Urban API
    var urban_request = settings.urbanAPI + mlabOptions.documents.queryText; // (parsedCommand.last ? mLabHelper.GetLastQueryForUser(req_team_id, req_user_id) : parsedCommand.Command);

    //set urban api url;
    var options = {
      url: urban_request
    };
    //hit up urban dictionary API
    request(options, function callback (error, response, body){
      if (!error && response.statusCode==200){

        //send the cleaned-up command and response type to parser
        //res.send(urbanParser.parse(body, parsedCommand.responseType, parsedCommand.rating));
        // changed in v0.4.1 to pass back the  entire parsedCommand
        res.send(urbanParser.parse(body, parsedCommand));

      }
      else {
        console.error();
      }

      //save the type of response from UD API
      var result_type = JSON.parse(body).result_type;

      //update lastPhrase if we've got an exact response
      if(result_type=="exact"){
        lastPhrase = mlabOptions.documents.queryText;
      }

      //record the result we got from UD API
      mlabOptions.documents.result_type = result_type;

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

  lastPhrase = mLabHelper.GetLastQuery();
  //used on server startup - query the storage and pull out last queried phrase
  while(lastPhrase === null || lastPhrase=== undefined ){
    lastPhrase = mLabHelper.GetLastQuery();
  }
});
