var baseQuery = '/v1/reverse?point.lat=%d&point.lon=%d';

var query_count = 10000;

var min_lat = 36.613061;
var min_lon = -112.772240;

var max_lat = 37.383826;
var max_lon = -110.160798;


for(var i = 0; i < query_count; i++) {
  var lat = Math.random() * (max_lat - min_lat) + min_lat;
  var lon = Math.random() * (max_lon - min_lon) + min_lon;

  console.log(baseQuery, lat, lon);
}
