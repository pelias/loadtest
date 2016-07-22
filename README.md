# Pelias loadtest

## Usage

`node index.js [file with URL fragments] [endpoint]`

example command: `node index.js acceptance_tests.txt 'http://pelias.dev.mapzen.com'`

example fragment file contents:
```
$ head data/nyc_reverse.txt
/v1/reverse?layers=address&sources=oa,osm&point.lat=40.6783253&point.lon=-74.0003566
/v1/reverse?layers=address&sources=oa,osm&point.lat=40.8289836&point.lon=-73.8538096
/v1/reverse?layers=address&sources=oa,osm&point.lat=40.6620808&point.lon=-73.8920193
/v1/reverse?layers=address&sources=oa,osm&point.lat=40.7771298&point.lon=-73.7827947
/v1/reverse?layers=address&sources=oa,osm&point.lat=40.6078153&point.lon=-73.9941793
/v1/reverse?layers=address&sources=oa,osm&point.lat=40.6175611&point.lon=-74.0098668
/v1/reverse?layers=address&sources=oa,osm&point.lat=40.7324096&point.lon=-73.8032791
/v1/reverse?layers=address&sources=oa,osm&point.lat=40.7420505&point.lon=-73.9257478
/v1/reverse?layers=address&sources=oa,osm&point.lat=40.7593663&point.lon=-73.7190877
/v1/reverse?layers=address&sources=oa,osm&point.lat=40.7130021&point.lon=-73.9810227
```

## Configuration

Be sure to edit `index.js` with a valid Pelias API key (if testing against Mapzen Search).

The concurrency level, and maximum number of queries to run can also be configured.

## How it works

Using the [loadtest](https://github.com/alexfernandez/loadtest) NPM module, run
a series of queries against a Pelias server. The queries are constructed from
query fragments and a host name, so the same queries can be run on and compared
between several different Pelias instances.

## What does it measure?

First, here's some example output:

```
$ node index.js data/ny_reverse_small.txt 'http://pelias.mapzen.com'
URL: http://pelias.mapzen.com
file: data/ny_reverse_small.txt
count: 1000
errors: 0
rps:  134
50th: 102ms
90th: 132ms
99th: 331ms
max:  472ms
slowest query: /v1/reverse?layers=address&sources=oa,osm&point.lat=43.3010384&point.lon=-76.4047045
```

The output starts with a reminder of what endpoint was hit, and what file was
used to generate the queries.

After that is more information about the test run

## Count
Total number of queries run

## Errors
Count of non-200 HTTP status codes. Other than this loadtest does nothing with
the responses from the queries

## RPS (requests per second)

The average number of requests executed per second. This is calculated by
taking the number of queries, divided by the time elapsed from when the first
query was sent, to when the last query was returned.

## 50th, 90th, 99th percentile times

Each request is also individually timed, and these are aggregated at the end of
the test run to calculate percentile response times for individual queries.

## Max response time
The response time of the single slowest request

## Slowest query

The query that was run that took the longest (it's the one that had the maximum
response time listed on the previous line).

Note: sometimes a query that is normally fast just happens to be run when the
Pelias instance is under very heavy load, and all responses are delayed, so the
query listed here may not be worth investigating further.

### Concurrency
There is no [parallelism](http://stackoverflow.com/questions/1050222/concurrency-vs-parallelism-what-is-the-difference#1050257)
in this code itself, since it's running in Node.js, however multiple requests
are allowed to be in flight at once. On a powerful enough Pelias instance,
higher concurrency levels can drastically increase the number of requests per
second measured (this is good!). However, too high of a concurrency level can
overload a Pelias instance, so depending on the hardware and query type, some
experimentation of the optimal setting will have to be done.

