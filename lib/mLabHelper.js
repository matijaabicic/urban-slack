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

exports.GetLastQueryForUser = function(team_id, user_id){
  var result = null;

  var queryOptions = {
      "database"        : settings.mongoDBName,
      "collectionName"  : "phrases",
      "query"           : '{"team_id" : "' + team_id +'","user_id" : "' + user_id + '"}',
      "limit"           : 1,
      "sortOrder"       : '{"datetime":-1}'
    };

    mlab.listDocuments(queryOptions, function(err, data){
      if(!err){
        //get rid of " marks
        result = JSON.stringify(data[0].queryText).replace(/\"/g, '');
      }
      else {
        result = err;
      }
    });

  return result;
};

//update user settings
exports.UpdateUserSettings = function(userKey, userSettings)
{
  //prepare mongo api query
  var queryOptions = {
      "database"        : settings.mongoDBName,
      "collectionName"  : "userSettings",
      "data"            : {
          "userKey" :userKey,
          "userValue" : userSettings
        },
      "query"           : '{"userKey" : "' + userKey +'"}',
      "upsert"          : true
    };

    //fire off the mogno api query
    mlab.updateDocuments(queryOptions, function(err, data){
      //debug only
      if(!err){
        //console.log("Saved user settings successfully.");
      }
      else {
        //console.log("Something went wrong");
      }
    });
};
//end updating user settings


//return all user settings
exports.GetAllUserSettings = function(){
  var result = null;

  //hit up mongo and return all user settings.
  var queryOptions = {
    "database"        : settings.mongoDBName,
    "collectionName"  : "userSettings",
  };

  mlab.listDocuments(queryOptions, function(err, data){
    if(!err)
    {
      result = data;
    }
    else{
      console.log("Error getting default user settings from database");
    }
  });

  return result;
};
//end of all user settings

// #43 - insert user feedback
exports.insertUserFeedback = function(userFeedback){
  //set the query to write to feedback collection
  var queryOptions = {
    "database"        : settings.mongoDBName,
    "collectionName"  : "feedback",
    "documents"       :
      {
          "feedback"  : userFeedback
      }
  };
  // write to mLabKey
  mlab.insertDocuments(queryOptions, function(err, data){
    if(err){console.log(err);}
    else{
      //debug only
      console.log(userFeedback);
      console.log(queryOptions);
    }
  });
};
