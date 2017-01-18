var settings = require('../settings');

//sanitizer helper.
var sanitizer = function(input){
  var output = '';

  //convert & to %26
  output = input.replace('&', '%26');

  return output;
};

// Added userDefaults in v1.0.0 to address #26 - User default settings
module.exports.parse = function (preParsedCommandText, userDefaultSettings){
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
  // Added userDefaults in v1.0.0 to address #26 - User default settings
  else if (userDefaultSettings)
  {
    result.responseType = userDefaultSettings.responseType;
  }
  else{
    result.responseType = settings.defaultSlackResponseMode;
  }

  // #43 - accept feedback with --feedback switch
  if (commandText.match(/--feedback/g) || commandText.match(/—feedback/g)){
    result.feedback = true;
    commandText = commandText.replace(/—feedback/g, '').replace(/--feedback/g,'');
  }

  // #45 - ability to produce a random (surprise) definition
  if (commandText.match(/--surprise/g) || commandText.match(/—surprise/g)){
    result.surprise = true;
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
  // Added userDefaults in v1.0.0 to address #26 - User default settings
  else if (userDefaultSettings)
  {
    result.rating = userDefaultSettings.rating;
  }
  else{
    result.rating = settings.defaultRating;
  }

  //look for "random" switch. will be used to censor the output.
  if (commandText.match(/--random/g) || commandText.match(/—random/g)){
    result.random = true;
    commandText = commandText.replace(/—random/g, '').replace(/--random/g,'');
  }
  // Also parsing --norandom in v1.0.0, to support switching default values in #26
  else if (commandText.match(/--norandom/g) || commandText.match(/—norandom/g)){
    result.random = false;
    commandText = commandText.replace(/—norandom/g, '').replace(/--norandom/g,'');
  }
  // Added userDefaults in v1.0.0 to address #26 - User default settings
  else if (userDefaultSettings)
  {
    result.random = userDefaultSettings.random;
  }
  else{
    result.random = settings.defaultRandomSetting;
  }

  //look for "last" switch. will be used to retrieve user's last query
  if (commandText.match(/--last/g) || commandText.match(/—last/g)){
    result.last = true;
    commandText = "";
  }

  // #26 - look for --set switch. will be used to set defaults for the user
  if (commandText.match(/--set/g) || commandText.match(/—set/g)){
    result.defaults = true;
    commandText = commandText.replace(/—set/g, '').replace(/--set/g,'');
  }
  // #41 - return user settings with --mysettings switch
  if (commandText.match(/--mysettings/g) || commandText.match(/—mysettings/g)){
    result.mysettings = true;
    commandText = commandText.replace(/—mysettings/g, '').replace(/--mysettings/g,'');
  }

  //now that we have picked up the switches and switches have been stripped out
  //return the cleaned-up command
  result.Command = sanitizer(commandText);
  return result;
};
