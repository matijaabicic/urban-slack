module.exports.help = function (responseType, req_command){
  var returnData = {};
  returnData.response_type  = responseType;
  returnData.username = "UrbanSlack";
  returnData.text = 'Usage: ' + req_command + ' [switch] phrase. For more see https://urban-slack.herokuapp.com/howto';
  returnData.attachments = [
    {
        "pretext" : "Response type switches available (Default: --private - visible only to user issuing the query)",
        "fields"  : [
                      {
                        "title":"Publically visible",
                        "value":"--public",
                        "short":true
                      },
                      {
                        "title":"Private",
                        "value":"--private",
                        "short":true
                      }
                    ]
    },
    {
      "pretext" : "Profanity filtering switches available (Default: --nsfw - Not safe for work. Because it's more fun that way.). If you use --sfw switch, all naughty-naughty words will be f**** censored",
      "fields"  : [
                    {
                      "title":"Safe For Work (SFW)",
                      "value":"--sfw",
                      "short":true
                    },
                    {
                      "title":"Not Safe For Work (NSFW)",
                      "value":"--nsfw",
                      "short":true
                    }
      ]
    },
    {
      "pretext" : "Random factor always makes things more fun. This will return a random definition for a search query instead of the most-upvoted one.",
      "fields"  : [
                    {
                      "title":"Random",
                      "value":"--random",
                      "short":true
                    },
                    {
                      "title":"Non-Random",
                      "value":"--norandom",
                      "short":true
                    }
      ]
    },
    {
      "pretext" : "Feeling lucky? Why not --surprise yourself and yoru channel. --surprise gives you a completely random phrase.",
      "fields"  : [
                    {
                      "title" : "Surprise",
                      "value" : "--surprise",
                      "short" : true
                    }
      ]
    },
    {
      "pretext" : "Don't botheer retyping that long phrase just to make make it --public. Just use --last",
      "fields"  : [
                    {
                      "title" : "Last",
                      "value" : "--last",
                      "short" : true
                    }
      ]
    },
    {
      "pretext" : "Tell Urban Slack to remember your user preferences. It's easy.",
      "fields"  : [
                    {
                      "title" : "User Preferences",
                      "value" : "--set <other switches to use as defaul. see below for examples>"
                    }
      ]
    },
    {
      "pretext" : "Example use cases",
      "fields"  : [
                    {
                      "title":"Example use 1:",
                      "value":req_command + ' FOMO',
                      "short":true
                    },
                    {
                      "title":"Example use 2:",
                      "value":req_command + ' --public FOMO --random',
                      "short":true
                    },
                    {
                      "title":"Example use 3:",
                      "value":req_command + ' --private FOMO',
                      "short":true
                    },
                    {
                      "title":"Example use 4:",
                      "value":req_command + ' --sfw --random FOMO',
                      "short":true
                    },
                    {
                      "title":"Example use 5:",
                      "value":req_command + ' --public --sfw FOMO',
                      "short":true
                    },
                    {
                      "title":"Example use 6:",
                      "value":req_command + ' --private --nsfw FOMO',
                      "short":true
                    },
                    {
                      "title":"Example use 7:",
                      "value":req_command + ' --set --private --random',
                      "short":true
                    },
                    {
                      "title":"Example use 8:",
                      "value":req_command + ' --set --public --norandom --sfw',
                      "short":true
                    },
                    {
                      "title":"Example use 9:",
                      "value":req_command + ' --surprise --public --sfw',
                      "short":true
                    }
      ]
    }

  ];

  return returnData;
};
