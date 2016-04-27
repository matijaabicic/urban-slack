
var settings        = require("../settings.js");
var assert          = require("assert");
var parser          = require("../lib/urban-parser.js");
var commandParser  = require("../lib/slack-command-parser.js");
var fs              = require("fs");

var obj = JSON.parse(fs.readFileSync('test/sampledata.js', 'utf8'));

describe("Internal testing", function() {

  // Urban Parser testing (responder)
  describe("Response parser testing (urban-parser.js)", function() {
    it("Parses simple, private response", function() {
      var api_result = JSON.stringify(obj.urbanparser.apiresponse);

      var expected_output = JSON.stringify(obj.urbanparser.correctoutput);
      var parse_result = JSON.stringify(parser.parse(api_result, JSON.parse('{"responseType":"ephemeral"}')));

      assert.equal(parse_result, expected_output);
    });
    it("Censors NSFW content", function (){
      //test data
      var api_result = JSON.stringify(obj.urbanparser.apiresponse);
      //expected data
      var expected_output = JSON.stringify(obj.urbanparser.sfwOutput);
      //actual result
      var parse_result = JSON.stringify(parser.parse(api_result, JSON.parse('{"responseType":"ephemeral","rating":"sfw","random":false}')));
      //compare and assert test
      assert.equal(parse_result, expected_output);
    });
    it("Responds with NSFW content", function (){
      //test data
      var api_result = JSON.stringify(obj.urbanparser.apiresponse);
      //expected data
      var expected_output = JSON.stringify(obj.urbanparser.correctoutput);
      //actual result
      var parse_result = JSON.stringify(parser.parse(api_result, JSON.parse('{"responseType":"ephemeral","rating":"nsfw","random":false}')));
      //compare and assert test
      assert.equal(parse_result, expected_output);
    });
    it("Responds publically in channel", function (){
      //test data
      var api_result = JSON.stringify(obj.urbanparser.apiresponse);
      //expected data
      var expected_output = JSON.stringify(obj.urbanparser.publicOutput);
      //actual result
      var parse_result = JSON.stringify(parser.parse(api_result, JSON.parse('{"responseType":"in_channel","rating":"sfw","random":false}')));
      //compare and assert test
      assert.equal(parse_result, expected_output);
    });
  });

  describe("Command parser testing (slack-command-parser.js)", function() {
    it("Parses help request", function(){
      var commandRequest = JSON.stringify(obj.commandparser.helpRequest);
      var expected_output =  JSON.stringify(obj.commandparser.helpRequest_result);

      assert.equal(JSON.stringify(commandParser.parse(commandRequest)),expected_output);
    });
    it("Parses public help request", function(){
      var commandRequest =JSON.stringify(obj.commandparser.publicHelpRequest);
      var expected_output = JSON.stringify(obj.commandparser.publicHelpRequest_result);

      assert.equal(JSON.stringify(commandParser.parse(commandRequest)), expected_output);
    });
    it("Parses SFW requests", function(){
      var commandRequest = JSON.stringify(obj.commandparser.sfwRequest);
      var expected_output=  JSON.stringify(obj.commandparser.sfwRequest_result);

      assert.equal(JSON.stringify(commandParser.parse(commandRequest)), expected_output);
    });
    it("Parses random requests", function(){
      var commandRequest = JSON.stringify(obj.commandparser.randomRequest);
      var expected_output = JSON.stringify(obj.commandparser.randomRequest_result);

      assert.equal(JSON.stringify(commandParser.parse(commandRequest)), expected_output);
    });
    it("Parses combined requests", function(){
      var commandRequest = JSON.stringify(obj.commandparser.comboRequest);
      var expected_output = JSON.stringify(obj.commandparser.comboRequest_result);

      assert.equal(JSON.stringify(commandParser.parse(commandRequest)), expected_output);
    });
    it("Parses --last switch", function(){
      var commandRequest = JSON.stringify(obj.commandparser.lastRequest);
      var expected_output = JSON.stringify(obj.commandparser.lastRequest_result);

      assert.equal(JSON.stringify(commandParser.parse(commandRequest)), expected_output);
    });
    it("Parses --more switch", function(){
      var commandRequest = JSON.stringify(obj.commandparser.moreRequest);
      var expected_output = JSON.stringify(obj.commandparser.moreRequest_result);

      assert.equal(JSON.stringify(commandParser.parse(commandRequest)), expected_output);
    });
  });
});
