var fs = require('fs');

var loadtest = require('loadtest');

var filename = process.argv[2];
var baseurl = process.argv[3];

function statusCallback(results) {
  process.stderr.write("\r" + results.totalRequests);

  if (results.totalRequests == urls.length) {
    process.stderr.write("\n");
  }
}

var urls = fs.readFileSync(filename).toString().split("\n").filter(function(string) { return string.length > 0; });

var api_key = 'CHANGEME';
var end = '&cachebust=' + Math.random() + '&api_key=' + api_key;

var i = 0;
function requestGenerator(params, options, client, callback) {
  var url = baseurl + urls[ i % urls.length] + end;
  i++;
  var request = client(url, callback);

  return request;
}

var options = {
  url: 'http://pelias.dev.mapzen.com/v1/',
  maxRequests: 1000, //urls.length,
  concurrency: 5,
  statusCallback: statusCallback,
  requestGenerator: requestGenerator
};


loadtest.loadTest(options, function(error, result) {
  if (error) {
    return console.error('Got an error: %s', error);
  }
  console.log('Tests run successfully');

  console.log(result);
});
