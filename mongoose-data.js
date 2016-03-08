var settings = require('./settings');
var mongoose = require('mongoose');

mongoose.connect(settings.mongodbConnectionString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.on('open', function(){
  console.log('Opened connection to database.');
});

var phraseSchema = new mongoose.Schema({
  content: String
});

var Phrase = db.model('Phrase', phraseSchema);

exports.phraseList = function(callback) {

  Phrase.find(function(err, phrases) {
    if (err) {
      callback('');
    } else {
      callback(phrases);
    }
  });

};

exports.savePhrase = function(gword) {

  var phrase = new Phrase({
    content: gword
  });

  phrase.save();
};
