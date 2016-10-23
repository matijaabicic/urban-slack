exports.confirm = function (){
  var returnData = {};
  returnData.response_type  = 'ephemeral';
  returnData.username = "UrbanSlack";

  // #43 in v1.1.0 - implemented in-app feedback with --feedback switch
  returnData.text = "Your feedback is much appreciated!! Thank you for asking to make Urban Slack better. Feel free to get in touch with @matijaabicic on Twitter and don't forget to check out https://urban-slack.herokuapp.com for details on how to get involved.";
  return returnData;
};
