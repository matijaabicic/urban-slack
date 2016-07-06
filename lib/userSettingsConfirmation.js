exports.confirm = function (settings){
  var returnData = {};
  returnData.response_type  = 'ephemeral';
  returnData.username = "UrbanSlack";

  // #41 in v1.0.2 - check that the user has indeed set defaults
  if (!settings){
    returnData.text = "You have no default settings. Use --set switch to set your settings. See help page for more info.";
  }
  else {
    returnData.text = (settings.getSettings) ? 'You have previously set default user settings.' : 'Default user settings are now confirmed.';
    var privacy = (settings.responseType == "ephemeral") ? "Empemeral (only you can see)" : "In-channel (everone can see)";
    var cleanliness = (settings.rating == "nsfw") ? "NSFW (not safe for work)" : "SFW (safe for work)";
    var randomness = settings.random ? "Random matching phrase" : "Non-random, best match";

    returnData.attachments = [
      {
          "pretext" : "Your default settings are",
          "fields"  : [
                        {
                          "title":"Privacy",
                          "value":privacy,
                          "short":true
                        },
                        {
                          "title":"Cleanliness",
                          "value":cleanliness,
                          "short":true
                        },
                        {
                          "title":"Randomness",
                          "value":randomness,
                          "short":true
                        }
                      ]
      }
    ];
  }
  return returnData;
};
