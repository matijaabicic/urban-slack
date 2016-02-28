module.exports.parse = function (bodyString){
    if(bodyString){
      //return bodyString.list[0].definition;
      var data = JSON.parse(bodyString);
      var numberOfDefinitions = data.list.length;
      if (numberOfDefinitions > 0)
      {
        var definition = data.list[0].definition;
        var example = data.list[0].example;


        var returnData = {};
        returnData.numberOfDefinitions = numberOfDefinitions;
        returnData.definition = definition;
        returnData.example = example;

        return returnData;
      }

    }
    else return "No result.";
};
