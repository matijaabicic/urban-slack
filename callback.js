//define callback function
var callback = function(error, response, body){
  if (!error && response.statusCode==200){
    console.log('works !!');
  }
  else {
    console.error();
  }
};

exports.callback = callback;
