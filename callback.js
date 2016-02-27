//define callback function

var callback = function(error, response, body){
  if (!error && response.statusCode==200){


  }
  else {
    console.log(error);
    return error;
  }
};

module.exports.callback = callback;
