//define callback function

var callback = function(error, response, body){
  if (!error && response.statusCode==200){

    console.log(body);
    global.urban_response = body;

  }
  else {
    console.error();
  }
};

module.exports.callback = callback;
