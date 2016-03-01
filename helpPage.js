module.exports.help = function (responseType, req_command){
  var returnData = {};
  returnData.response_type  = responseType;
  returnData.username = "UrbanSlack";
  returnData.text = 'Usage: ' + req_command + ' [switch] phrase';
  returnData.attachments = [
    {
        "pretext": "Switches available (Default: --private - visible only to user issuing the query)",
        "fields": [
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
      "pretext" : "Example use 1:",
      "text"    : req_command + ' FOMO'
    },
    {
      "pretext" : "Example use 2:",
      "text"    : req_command + ' --private FOMO'
    },
    {
      "pretext" : "Example use 3:",
      "text"    : req_command + ' --public FOMO'
    }

  ];

  return returnData;
};
