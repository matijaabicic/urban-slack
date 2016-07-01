exports.confirm = function (settings){
  var returnData = {};
  returnData.response_type  = 'ephemeral';
  returnData.username = "UrbanSlack";
  returnData.text = 'Default user settings are now confirmed.';

  // {"responseType":"in_channel","rating":"nsfw","random":true,"defaults":true,"Command":"\"/urban    \""}
  // {"responseType":"ephemeral","rating":"sfw","random":false,"defaults":true,"Command":"\"/urban  \""},

  var privacy = (settings.responseType == "ephemeral") ? "Empemeral (only you can see)" : "In-channel (everone can see)";
  var cleanliness = (settings.rating == "nsfw") ? "NSFW (not safe for work)" : "SFW (safe for work)";
  var randomness = settings.random ? "Random matching phrase" : "Non-random, best match";

  returnData.attachments = [
    {
        "pretext" : "Your new default settings are",
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

  return returnData;
};
