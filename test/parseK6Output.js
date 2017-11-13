const tape = require('tape');
const fs = require('fs');
const path = require('path');

const exampleInput = fs.readFileSync(path.join(__dirname, 'exampleInput.txt')).toString();

const parseK6Output = require('../src/parseK6Output');

tape('parseK6Output', (test) => {
  test.test('http_req_duration statistics can be parsed', (t) => {
    const actual = parseK6Output(exampleInput);
    t.equal(actual.duration.max, 1.4, 'max duration in seconds returned');
    t.equal(actual.duration.p95, 0.27177, 'p95 duration in seconds returned');
    t.end();
  });

  test.test('throughput can be parsed', (t) => {
    const actual = parseK6Output(exampleInput);
    t.equal(actual.throughput, 132.4, 'throughput in requests/second is parsed');
    t.end();
  });
});
