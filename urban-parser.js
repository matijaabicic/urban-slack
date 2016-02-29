module.exports.parse = function (bodyString){

  //prepare the data to return to Slack
  var returnData = {};
  returnData.response_type  = "in_channel";
  returnData.username = "UrbanSlack";

    if(bodyString){
      //return bodyString.list[0].definition;
      var data = JSON.parse(bodyString);

      switch(data.result_type)
      {
        case "exact":
        {
          var numberOfDefinitions = data.list.length;
          if (numberOfDefinitions > 0)
          {
            var definition = data.list[0].definition;
            var example = data.list[0].example;

            returnData.text = '*DEFINITION (1 of ' + numberOfDefinitions +'):* ' + definition;
            returnData.attachments = [{"title":"Example use", "text": example}];
          }
          else
          {
              returnData.text = 'No definition.';
          }
        }
        break;

        case "no_results":
        {
          returnData.text = 'No definition.';
        }

        default:
        {
          returnData.text = "No definition.";  // throw "Unexpected behaviour.";
        }
      }
    }
    else //service should return response even if there are no entries so I conclude there is something wrong with it
    {
      returnData.text = 'Dictionary service unavailable.';
    }

    //return slack response.
    return returnData;
};
