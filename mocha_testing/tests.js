
var assert = require("assert");
var parser = require("../lib/urban-parser.js");
var fs = require("fs");

var obj = JSON.parse(fs.readFileSync('mocha_testing/sampledata.js', 'utf8'));

describe("Internal testing", function() {
  describe("urban-parser", function() {
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
});
