
var assert = require("assert");
var parser = require("../lib/urban-parser.js");
var fs = require("fs");

var obj = JSON.parse(fs.readFileSync('mocha_testing/sampledata.js', 'utf8'));

describe("Internal testing", function() {
  describe("urban-parser", function() {
    it("parses correct json result", function() {
      var api_result = JSON.stringify(obj.urbanparser.apiresponse);

      var expected_output = JSON.stringify(obj.urbanparser.correctoutput);
      var parse_result = JSON.stringify(parser.parse(api_result, JSON.parse('{"responseType":"ephemeral","rating":"nsfw","random":false}')));

      assert.equal(parse_result, expected_output);
    });
  });
});
