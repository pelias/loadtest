const child_process = require('child_process');

const _ = require('lodash');

const parseK6Output = require('../src/parseK6Output');

const testCases = [
  'reverse_mongolia',
  'reverse_nyc',
  'structured_nyc',
  'structured_des_moines',
  'search_nyc',
  'search_des_moines',
  'acceptance_tests'
];

const concurrencies = [1, 3, 5, 7, 10];

const iterations = 3;

const testDurationInSeconds = 60;

const results = {};

const iteration_array = Array.apply(null, {length: iterations}).map(Number.call, Number);

testCases.forEach(testCase => {
  results[testCase] = {};

  concurrencies.forEach(concurrency => {
    results[testCase][concurrency] = [];

    iteration_array.forEach((_, iteration) => {
      console.log(`iteration: ${iteration}, concurrency: ${concurrency}, testCase: ${testCase}`);

      const command = `./bin/k6 run -d ${testDurationInSeconds}s ./tests/${testCase}.js`;
      const options = {
        env: {
          VU: concurrency,
          HOST: process.env.HOST,
          API_KEY: process.env.API_KEY
        }
      };
      const output = child_process.execSync(command, options).toString();
      console.log(output);
      const test_result = parseK6Output(output);
      console.log(test_result);

      results[testCase][concurrency].push(test_result);
    });
  });
});

console.log(JSON.stringify(results,null,2));

function median(values) {
    values.sort( function(a,b) {return a - b;} );

    const half = Math.floor(values.length/2);

    if (values.length % 2) {
          return values[half];
    } else {
          return (values[half-1] + values[half]) / 2.0;
    }
}

function aggregateDuration(durationsArray) {
  const properties = ['min', 'avg', 'med', 'p90', 'p95', 'max'];

  const result = {};
  properties.forEach(prop => {
    result[prop] = median(durationsArray.map(value => value[prop]));
  });

  return result;

}

// takes an array of test results and produces an aggregate result
// currently the aggregation method is to take the median
function aggregateMultipleRuns(test_results) {
  const result = {
    duration: aggregateDuration(test_results.map(result => result.duration)),
    throughput: median(test_results.map(result => result.throughput))
  };

  console.log(result);
  return result;
}

const data = { "acceptance_tests": {
          "1": [
                  {
                            "duration": {
                                        "avg": 0.06977,
                                        "max": 0.74841,
                                        "med": 0.03817,
                                        "min": 0.01827,
                                        "p90": 0.12721,
                                        "p95": 0.17773
                                      },
                            "throughput": 14.2
                          },
                  {
                            "duration": {
                                        "avg": 0.06441,
                                        "max": 0.71241,
                                        "med": 0.03599,
                                        "min": 0.0172,
                                        "p90": 0.13046,
                                        "p95": 0.15155
                                      },
                            "throughput": 15.3
                          },
                  {
                            "duration": {
                                        "avg": 0.06767,
                                        "max": 0.67668,
                                        "med": 0.03508,
                                        "min": 0.01819,
                                        "p90": 0.12173,
                                        "p95": 0.15934
                                      },
                            "throughput": 14.7
                          }
                ]
        }
}


console.log(JSON.stringify(aggregateMultipleRuns(results["acceptance_tests"]["1"]), null, 2));
console.log(JSON.stringify(aggregateMultipleRuns(results["acceptance_tests"]["5"]), null, 2));
console.log(JSON.stringify(aggregateMultipleRuns(results), null, 2));


