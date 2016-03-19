var settings = require('../settings');

module.exports.parse = function (commandText){
  var result = {};

  //look for "public and private switches switch"
  //there is a hierarhy implied here
  // - first look for private, then public, default to settings.js
  // — is the os x autocorrection of --
  if (commandText.match(/--private/g) || commandText.match(/—private/g)){
    result.responseType = 'ephemeral';
  }
  else if (commandText.match(/--public/g) || commandText.match(/—public/g))
  {
    result.responseType = "in_channel";
  }
  else{
    result.responseType = settings.defaultSlackResponseMode;
  }

  //look for "sfw" switch. will be used to censor the output.
  if (commandText.match(/--sfw/g) || commandText.match(/—sfw/g)){
    result.rating = 'sfw';
  }
  else if (commandText.match(/--nsfw/g) || commandText.match(/—nsfw/g)){
    result.rating = 'nsfw';
  }
  else{
    result.rating = settings.defaultRating;
  }

  //now that we have picked up the switches, remove them from the string and
  //return the cleaned-up command
  result.Command = commandText.replace(/--public/g, '').replace(/--private/g, '').replace(/—private/g, '').replace(/—public/g, '');

  return result;
};
