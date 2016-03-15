var settings = require('../settings');

module.exports.parse = function (commandText){
  var result = {};

  //look for "public and private switches switch"
  //there is a hierarhy implied here
  // - first look for private, then public, default to settings.js
  if (commandText.match(/--private/g)){
    result.responseType = 'ephemeral';
  }
  else if (commandText.match(/--public/g))
  {
    result.responseType = "in_channel";
  }
  else{
    result.responseType = settings.defaultSlackResponseMode;
  }


  //now that we have picked up the switches, remove them from the string and
  //return the cleaned-up command
  result.Command = commandText.replace(/--public/g, '').replace(/--private/g, '');

  return result;
};
