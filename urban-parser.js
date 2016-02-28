module.exports.parse = function (bodyString){

  //prepare the data to return to Slack
  var returnData = {};
  returnData.response_type  = "in_channel";
  returnData.username = "UrbanSlack";

    if(bodyString){
      //return bodyString.list[0].definition;
      var data = JSON.parse(bodyString);
      var numberOfDefinitions = data.list.length;
      if (numberOfDefinitions > 0)
      {
        var definition = data.list[0].definition;
        var example = data.list[0].example;

        //returnData.numberOfDefinitions = numberOfDefinitions;
        returnData.text = '*DEFINITION (1 of ' + numberOfDefinitions +'):* ' + definition;
        returnData.attachments = [{"title":"Example use", "text": example}];
        return returnData;
      }

    }
    //if there is no body, jsut return "no definition".
    else returnData.text = 'No definition.';

    //return slack response.
    return returnData;
};
