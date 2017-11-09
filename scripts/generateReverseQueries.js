/*
 * Generate a bunch of reverse queries, with points within a given bounding box
 */
const baseQuery = '/v1/reverse?point.lat=%d&point.lon=%d';

const query_count = process.env.count || 1000;

const min_lat = parseFloat(process.env.min_lat);
const min_lon = parseFloat(process.env.min_lon);

const max_lat = parseFloat(process.env.max_lat);
const max_lon = parseFloat(process.env.max_lon);


// start the output of the giant json array
console.log('module.exports.data = [');

const outputFileLine = `"${baseQuery}",`
for(var i = 0; i < query_count; i++) {
  var lat = Math.random() * (max_lat - min_lat) + min_lat;
  var lon = Math.random() * (max_lon - min_lon) + min_lon;

  console.log(outputFileLine, lat, lon);
}

console.log(']');
