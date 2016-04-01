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
      "pretext" : "Example use cases",
      "fields"  : [
                    {
                      "title":"Example use 1:",
                      "value":req_command + ' FOMO',
                      "short":true
                    },
                    {
                      "title":"Example use 2:",
                      "value":req_command + ' --public FOMO',
                      "short":true
                    },
                    {
                      "title":"Example use 3:",
                      "value":req_command + ' --private FOMO',
                      "short":true
                    },
                    {
                      "title":"Example use 4:",
                      "value":req_command + ' --sfw FOMO',
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
                    }
      ]
    }

  ];

  return returnData;
};
