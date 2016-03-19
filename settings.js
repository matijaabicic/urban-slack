//app-specific sentence

module.exports = {
  debug                     : false,
  serverPort                : 5000,
  GA                        : 'UA-74299720-1', // Google analytics tracking ID
  urbanAPI                  : 'http://api.urbandictionary.com/v0/define?term=',
  gaIgnoreHosts             : ['localhost:8080', 'localhost:5000', 'urban-slack.com'], //list of hosts to be ignored on API paths

  //slack response modes:
  // ephemeral - only visible to user who isseus the slash command
  // in_channel - visible to everyone in the chat window (direct, group, channel)
  defaultSlackResponseMode  : 'ephemeral',

  slackOAuthURI             : 'https://slack.com/api/oauth.access',
  slackRedirectURI_local    : 'http://localhost:5000/AddSlack',
  slackRedirectURI_heroku   : 'https://urban-slack.herokuapp.com/AddSlack',
  mongoDBName               : 'urbanslack',

  //by default, do not filter out profanity. 
  defaultRating             : 'nsfw'

};
