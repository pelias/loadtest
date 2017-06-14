const fs = require('fs');
const csv = require('csv');
const _ = require('lodash');

//console.log('loading file');
const contents = fs.readFileSync('./data/city_of_new_york.csv');

//console.log('parsing CSV');
csv.parse(contents, {columns: true}, function(err, output) {
  //console.log(`parsing ${output.length} rows`);
  const reduced = output.map(function(row) {
    return _.pick(row, ['NUMBER', 'STREET', 'CITY', 'POSTCODE']);
  });
  
  const randomized = _.shuffle(reduced);
  
  const shortened = randomized.slice(0, 2000);

  //console.log(`reduced to ${shortened.length} rows`);

  process.stdout.write('module.exports.data=');
  console.log(JSON.stringify(shortened));
});
