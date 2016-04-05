var swearjar = require('swearjar');

//module.exports.parse = function (bodyString, responseType, filter){
// changed in v0.4.1 to pass back the  entire parsed Command
exports.parse = function (bodyString, parsedCommand){

  //prepare the data to return to Slack
  var returnData = {};
  var chosenDefinition = 0;
  returnData.response_type  = parsedCommand.responseType;
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

            //#33 implemented here in v0.4.2
            if(parsedCommand.random)
            {
              //choose a random number between 0 and [number of definitions returned
              // from dictionary]
              chosenDefinition = Math.floor(Math.random() * numberOfDefinitions);
            }

            var definition = data.list[chosenDefinition].definition;
            var example = data.list[chosenDefinition].example;

            //if we need to censor out NSFW stuff...better get to it before we send a response back.
            if (parsedCommand.filter=="sfw"){
              definition = swearjar.censor(definition);
              example    = swearjar.censor(example);
            }

            returnData.text = '*DEFINITION (' + (chosenDefinition + 1) + ' of ' + numberOfDefinitions +'):* ' + definition;

            returnData.attachments = [
              {
                "title":"Example use", "text": example
              }];

            //add a sound if it's contained in the response
            if (data.sounds.length > 0){

              //#33 randomize the sounds as well in v0.4.2
              if(parsedCommand.random)
              {
                //choose a random number between 0 and [number of definitions returned
                // from dictionary]
                chosenDefinition = Math.floor(Math.random() * data.sounds.length);
              }

              returnData.attachments.push({
                "title" : "Hear it :sound:",
                "title_link"  : data.sounds[chosenDefinition]
              });
            }

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
        break;

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
