var settings = require("../settings");
var secrets = require('../secrets');
var mLabKey = (process.env.mLabApiKey ? process.env.mLabApiKey : secrets.mLabApiKey);
var mlab = require('mongolab-data-api')(mLabKey);


// GetLastQuery
// Returns the latest query that returned exact results
exports.GetLastQuery = function(){
  var result = null;
  var queryOptions = {
      "database"        : settings.mongoDBName,
      "collectionName"  : "phrases",
      "query"           : '{"result_type" : "exact"}',
      "limit"           : 1,
      "sortOrder"       : '{"datetime":-1}'
    };

  mlab.listDocuments(queryOptions, function(err, data){
    if(!err){
      result = JSON.stringify(data[0].queryText);
    }
    else{
      result = err;
    }
  });
  return result;
};
//end GetLastQuery
