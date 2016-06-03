var settings = require('../settings');

//sanitizer helper.
var sanitizer = function(input){
  var output = '';

  //convert & to %26
  output = input.replace('&', '%26');

  return output;
};

module.exports.parse = function (preParsedCommandText){
  var result = {};
  var commandText = preParsedCommandText;
  //look for "public and private switches switch"
  //there is a hierarhy implied here
  // - first look for private, then public, default to settings.js
  // — is the os x autocorrection of --
  if (commandText.match(/--private/g) || commandText.match(/—private/g)){
    result.responseType = 'ephemeral';
    //remove switch from response
    commandText = commandText.replace(/--private/g, '').replace(/—private/g, '');
  }
  else if (commandText.match(/--public/g) || commandText.match(/—public/g))
  {
    result.responseType = "in_channel";
    commandText = commandText.replace(/--public/g, '').replace(/—public/g, '');
  }
  else{
    result.responseType = settings.defaultSlackResponseMode;
  }

  //look for "sfw" switch. will be used to censor the output.
  if (commandText.match(/--sfw/g) || commandText.match(/—sfw/g)){
    result.rating = 'sfw';
    commandText = commandText.replace(/--sfw/g, '').replace(/—sfw/g, '');
  }
  else if (commandText.match(/--nsfw/g) || commandText.match(/—nsfw/g)){
    result.rating = 'nsfw';
    commandText = commandText.replace(/—nsfw/g, '').replace(/--nsfw/g,'');
  }
  else{
    result.rating = settings.defaultRating;
  }

  //look for "random" switch. will be used to censor the output.
  if (commandText.match(/--random/g) || commandText.match(/—random/g)){
    result.random = true;
    commandText = commandText.replace(/—random/g, '').replace(/--random/g,'');
  }
  else{
    result.random = settings.defaultRandomSetting;
  }

  //look for "last" switch. will be used to retrieve user's last query
  if (commandText.match(/--last/g) || commandText.match(/—last/g)){
    result.last = true;
    commandText = "";
  }

  //now that we have picked up the switches and switches have been stripped out
  //return the cleaned-up command
  result.Command = sanitizer(commandText);
  return result;
};
