var loadtest = require( 'loadtest' );



function statusCallback(results) {
  //console.log(results.totalRequests);
  //console.log(arguments);
  //console.log('Current latency %j, result %j', latency, error ? JSON.stringify(error) + result.toString() : result);
  //console.log('----');
  //console.log('Request elapsed milliseconds: ', error ? error.requestElapsed : result.requestElapsed);
  //console.log('Request index: ', error ? error.requestIndex : result.requestIndex);
  //console.log('Request loadtest() instance index: ', error ? error.instanceIndex : result.instanceIndex);
}

var urls = [
  'http://pelias.dev.mapzen.com/v1/search?text=london',
  'http://pelias.dev.mapzen.com/v1/search?text=san francisco',
];


var i = 0;
function requestGenerator(params, options, client, callback) {
  var url = urls[i % urls.length];
  i++;
  var request = client(url, callback);

  return request;
}

var options = {
  url: 'http://pelias.dev.mapzen.com/v1/',
  maxRequests: 100,
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
