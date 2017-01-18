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
        // #45 - random lookup don't come with result type element.
        // added in v1.2.0 as a special case
        case (undefined && parsedCommand.surprise):
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
            var permalink = data.list[chosenDefinition].permalink;

            //if we need to censor out NSFW stuff...better get to it before we send a response back.
            if (parsedCommand.rating=="sfw"){
              definition = swearjar.censor(definition);
              example    = swearjar.censor(example);
            }
            var promptForFeedbackString = "";
            if (parsedCommand.prompt)
            {
              promptForFeedbackString = "This is a random prompt for feedback. Feel free to use `/urban --feedback Your Feedback Here` to tell us what you think about Urban Slack.\n";
            }
            returnData.text = promptForFeedbackString + '*DEFINITION (' + (chosenDefinition + 1) + ' of ' + numberOfDefinitions +'):* ' + definition;

            returnData.attachments = [
              {
                "title":"Example use", "text": example
              }];

            //add a sound if it's contained in the response
            // #45 - random (surprise) results don't return the sounds node. safe check.
            if (!parsedCommand.surprise && data.sounds.length > 0){

              //#33 randomize the sounds as well in v0.4.2
              if(parsedCommand.random)
              {
                //choose a random number between 0 and [number of definitions returned
                // from dictionary]
                chosenDefinition = Math.floor(Math.random() * data.sounds.length);
              }

              returnData.attachments.push({
                "title"       : "Hear it :sound:",
                "title_link"  : data.sounds[chosenDefinition],
                "short"       : true
              });
            }

            // #10 implemented in v0.5 - add link for more definitions
            if(numberOfDefinitions > 1){
              returnData.attachments.push({
                "title"       : "See more definitions",
                "title_link"  : permalink,
                "short"       : true
              });
            }

          }
          else
          {
              returnData.text = 'No definitions found. Use /urban ? for help or go to https://urban-slack.herokuapp.com for help.';
          }
        }
        break;

        case "no_results":
        {
          returnData.text = 'No definitions found. Use /urban ? for help or go to https://urban-slack.herokuapp.com for help.';
        }
        break;

        default:
        {
          returnData.text = "No definitions found. Use /urban ? for help or go to https://urban-slack.herokuapp.com for help.";  // throw "Unexpected behaviour.";
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
