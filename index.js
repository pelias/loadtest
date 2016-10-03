var fs = require('fs');

var loadtest = require('loadtest');

var filename = process.argv[2];
var baseurl = process.argv[3];

// CONFIGURATON SECTION: EDIT THESE! :)
var api_key = 'CHANGEME';
var concurrency = 15;
var maxRequests = 1000;

/*
 * Called after every request returns.
 * Used to print out how many queries have been run
 *
 * Note, it seems to be called AFTER the final results are sent off,
 * so there is some trickery to make it do nothing on the last request
 */

var slowest_time = 0;
var slowest_url;

function statusCallback(error, result, summaryInfo) {
  if (result.requestElapsed > slowest_time) {
    slowest_time = result.requestElapsed;
    slowest_url = urls[result.requestIndex];
  }
  if (summaryInfo.totalRequests == options.maxRequests) {
    return;
  }

  if (summaryInfo.totalRequests == options.maxRequests -1) {
    process.stdout.write("\r");
    return;
  }

  process.stdout.write("\r" + summaryInfo.totalRequests);
}

// read an entire file of urls into an array
var urls = fs.readFileSync(filename).toString().split("\n").filter(function(string) { return string.length > 0; });

var end = '&cachebust=' + Math.random() + '&api_key=' + api_key;

// generate requests using the urls from the file
var i = 0;
function requestGenerator(params, options, client, callback) {
  var url = baseurl + urls[ i % urls.length] + end;
  i++;
  var request = client(url, callback);

  return request;
}

var options = {
  url: 'http://pelias.dev.mapzen.com/v1/',
  maxRequests: Math.min(maxRequests, urls.length),
  concurrency: concurrency,
  statusCallback: statusCallback,
  requestGenerator: requestGenerator
};


// display info at the end of the load test
loadtest.loadTest(options, function(error, result) {
  if (error) {
    return console.error('Got an error: %s', error);
  }

  var error_count = Object.keys(result.errorCodes).reduce(function(acc, i) {
    return result.errorCodes[i] + acc;
  }, 0);

  process.stdout.write('URL: ' + baseurl + '\n');
  process.stdout.write('file: ' + filename + '\n');
  process.stdout.write('count: ' + options.maxRequests + '\n');
  process.stdout.write('errors: ' + error_count + '\n');
  process.stdout.write('rps:  ' + result.rps + '\n');
  process.stdout.write('50th: ' + result.percentiles[50] + "ms\n");
  process.stdout.write('90th: ' + result.percentiles[90] + "ms\n");
  process.stdout.write('99th: ' + result.percentiles[99] + "ms\n");
  process.stdout.write('max:  ' + result.maxLatencyMs + "ms\n");
  process.stdout.write('slowest query: ' + slowest_url + "\n");
});
