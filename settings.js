//app-specific sentence

module.exports = {
  debug : false,
  serverPort : 8080,
  GA : 'UA-74299720-1', // Google analytics tracking ID
  urbanAPI : 'http://api.urbandictionary.com/v0/define?term=',
  gaIgnoreHosts: ['localhost:8080', 'localhost:5000', 'urban-slack.com'], //list of hosts to be ignored on API paths

  //slack response modes:
  // ephemeral - only visible to user who isseus the slash command
  // in_channel - visible to everyone in the chat window (direct, group, channel)
  defaultSlackResponseMode : 'ephemeral',
  slackOAuthURI: 'https://slack.com/api/oauth.access'

};
