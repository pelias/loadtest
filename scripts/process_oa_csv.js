const fs = require('fs');
const csv_parse = require('csv-parse');
const _ = require('lodash');

const count = process.env.count || 1000;
const file = process.env.filename || './data/city_of_new_york.csv';

//console.log('loading file');
const contents = fs.readFileSync(file);

//console.log('parsing CSV');
csv_parse(contents, {columns: true}, function(err, output) {
  const reduced = output.map(function(row) {
    return _.pick(row, ['NUMBER', 'STREET', 'CITY', 'POSTCODE']);
  });

  const randomized = _.shuffle(reduced);

  const shortened = randomized.slice(0, count);

  process.stdout.write('module.exports.data=');
  console.log(JSON.stringify(shortened));
});
