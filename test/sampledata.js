{
  "urbanparser": {
    "apiresponse": {

      "tags": [],
      "result_type": "exact",
      "list": [{
        "defid": 6394950,
        "word": "asdasdasd",
        "author": "etymologynerd1950",
        "permalink": "http://asdasdasd.urbanup.com/6394950",
        "definition": "left handed three finger pinkie to middle typing boredom filler like tapping those fingers on a table, similar dick to\n\nal;sdkjf;aslkdjf;alskdjf;alskdjf;alsdkjf, the alternating eight finger pinky to forefinger right and left hand keyboard doodling",
        "example": "asdasdasdasdsdasdasdadasdsd",
        "thumbs_up": 187,
        "thumbs_down": 65,
        "current_vote": ""
      }],
      "sounds": []

    },
    "correctoutput": {
      "response_type": "ephemeral",
      "username": "UrbanSlack",
      "text": "*DEFINITION (1 of 1):* left handed three finger pinkie to middle typing boredom filler like tapping those fingers on a table, similar dick to\n\nal;sdkjf;aslkdjf;alskdjf;alskdjf;alsdkjf, the alternating eight finger pinky to forefinger right and left hand keyboard doodling",
      "attachments": [{
        "title": "Example use",
        "text": "asdasdasdasdsdasdasdadasdsd"
      }]
    },
    "sfwOutput":{
      "response_type": "ephemeral",
      "username": "UrbanSlack",
      "text": "*DEFINITION (1 of 1):* left handed three finger pinkie to middle typing boredom filler like tapping those fingers on a table, similar **** to\n\nal;sdkjf;aslkdjf;alskdjf;alskdjf;alsdkjf, the alternating eight finger pinky to forefinger right and left hand keyboard doodling",
      "attachments": [{
        "title": "Example use",
        "text": "asdasdasdasdsdasdasdadasdsd"
      }]
    },
    "publicOutput":{
      "response_type": "in_channel",
      "username": "UrbanSlack",
      "text": "*DEFINITION (1 of 1):* left handed three finger pinkie to middle typing boredom filler like tapping those fingers on a table, similar **** to\n\nal;sdkjf;aslkdjf;alskdjf;alskdjf;alsdkjf, the alternating eight finger pinky to forefinger right and left hand keyboard doodling",
      "attachments": [{
        "title": "Example use",
        "text": "asdasdasdasdsdasdasdadasdsd"
      }]
    }
  },
  "commandparser": {
    "helpRequest"                     : "/urban ?",
    "helpRequest_result"              : {"responseType":"ephemeral","rating":"nsfw","random":false,"Command":"\"/urban ?\""},
    "publicHelpRequest"               : "/urban ? --public",
    "publicHelpRequest_result"        : {"responseType":"in_channel","rating":"nsfw","random":false,"Command":"\"/urban ? \""},
    "sfwRequest"                      : "/urban kevin --sfw",
    "sfwRequest_result"               : {"responseType":"ephemeral","rating":"sfw","random":false,"Command":"\"/urban kevin \""},
    "randomRequest"                   : "/urban kevin --random",
    "randomRequest_result"            : {"responseType":"ephemeral","rating":"nsfw","random":true,"Command":"\"/urban kevin \""},
    "norandomRequest"                 : "/urban kevin --norandom",
    "norandomRequest_result"          : {"responseType":"ephemeral","rating":"nsfw","random":false,"Command":"\"/urban kevin \""},
    "comboRequest"                    : "/urban hello --random --public --sfw",
    "comboRequest_result"             : {"responseType":"in_channel","rating":"sfw","random":true,"Command":"\"/urban hello   \""},
    "lastRequest"                     : "/urban --last",
    "lastRequest_result"              : {"responseType":"ephemeral","rating":"nsfw","random":false,"last":true,"Command":""},
    "ampRequest"                      : "/urban f&f",
    "ampRequest_result"               : {"responseType":"ephemeral","rating":"nsfw","random":false,"Command":"\"/urban f%26f\""},
    "defaultsPublicRequest"           : "/urban --set --public",
    "defaultsPublicRequest_result"    : {"responseType":"in_channel","rating":"nsfw","random":false,"defaults":true,"Command":"\"/urban  \""},
    "defaultsRequest"                 : "/urban --set",
    "defaultsRequest_result"          : {"responseType":"ephemeral","rating":"nsfw","random":false,"defaults":true,"Command":"\"/urban \""},
    "defaultsPrivateRequest"          : "/urban --set --private",
    "defaultsPrivateRequest_result"   : {"responseType":"ephemeral","rating":"nsfw","random":false,"defaults":true,"Command":"\"/urban  \""},
    "defaultsSfwRequest"              : "/urban --set --sfw",
    "defaultsSfwRequest_result"       : {"responseType":"ephemeral","rating":"sfw","random":false,"defaults":true,"Command":"\"/urban  \""},
    "defaultsNsfwRequest"             : "/urban --set --nsfw",
    "defaultsNsfwRequest_result"      : {"responseType":"ephemeral","rating":"nsfw","random":false,"defaults":true,"Command":"\"/urban  \""},
    "defaultsRandomRequest"           : "/urban --set --random",
    "defaultsRandomRequest_result"    : {"responseType":"ephemeral","rating":"nsfw","random":true,"defaults":true,"Command":"\"/urban  \""},
    "defaults3SwitchesRequest"        : "/urban --set --random --public --nsfw",
    "defaults3SwitchesRequest_result" : {"responseType":"in_channel","rating":"nsfw","random":true,"defaults":true,"Command":"\"/urban    \""},
    "defaultsChecker"                 : "/urban --mysettings",
    "defaultsChecker_result"          : {"responseType":"ephemeral","rating":"nsfw","random":false,"mysettings":true,"Command":"\"/urban \""}
  }
}
