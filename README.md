# Pelias loadtest

This repository contains tools for loadtesting a pelias instance.

It uses the [k6](https://k6.io/) librarfy for loadtesting. Previously, it used
the [loadtest](https://www.npmjs.com/package/loadtest) NPM module, but that
module wasn't able to load test over ~400 requests/second, which a
well-provisioned Pelias instance is easily able to surpass.

## Usage

The main way to use this repo is to run the full test suite to test a wide variety of queries:

```
export API_KEY=<your api KEY if testing a Mapzen Search instance>
export HOST="http://your-pelias-instance"
./test.sh
```

## Example output

The [output](https://k6.readme.io/docs/results-output) from K6 is quite nice and thorough, and looks like this:

```

          /\      |‾‾|  /‾‾/  /‾/   
     /\  /  \     |  |_/  /  / /   
    /  \/    \    |      |  /  ‾‾\  
   /          \   |  |‾\  \ | (_) | 
  / __________ \  |__|  \__\ \___/  Welcome to k6 v0.17.1!

  execution: local
     output: -
     script: /home/julian/repos/pelias/loadtest/tests/search_des_moines.js (js)

   duration: 3m0s, iterations: 0
        vus: 5, max: 5

    web ui: http://127.0.0.1:6565/

^C      done [==========================================================]      34.8s / 34.8s

    ✓ status was not 401
    ✗ request time under 200ms
          16.45% (124/754) 
    ✓ status was 200
    ✓ status was not 429

    checks................: 95.89%
    data_received.........: 6.8 kB (199 B/s)
    data_sent.............: 866 B (25 B/s)
    http_req_blocked......: avg=250.91µs max=38.55ms med=2.43µs min=1.38µs p(90)=3.18µs p(95)=3.4µs
    http_req_connecting...: avg=73.26µs max=11.96ms med=0s min=0s p(90)=0s p(95)=0s
    http_req_duration.....: avg=230.49ms max=6.89s med=85.2ms min=52.58ms p(90)=348.44ms p(95)=1.36s
    http_req_receiving....: avg=160.64µs max=4.61ms med=131.35µs min=78.77µs p(90)=180.67µs p(95)=205.1µs
    http_req_sending......: avg=19.97µs max=119.23µs med=18.78µs min=10.32µs p(90)=24.91µs p(95)=27.52µs
    http_req_waiting......: avg=230.31ms max=6.89s med=85.07ms min=52.4ms p(90)=348.13ms p(95)=1.36s
    http_reqs.............: 754 (22.176470588235293/s)
    vus...................: 5
    vus_max...............: 5
```

The most important pieces of output are generally the following:

* results of any checks (such as status code 200 above)
* http\_req\_duration metrics: especially p(95). This measures the entire elapsed time of a request (it really should be ordered differently instead of put in the middle)
* http\_reqs: the total number of requests sent and the average total throughput
* vus: this is the measure of concurrency in k6, and should match whatever was configured by the tests

## Pelias test suite contents

There are currently several test suites for different types of Pelias requests.

### Reverse Geocoding in NYC and Mongolia
These tests use randomly generated points within areas corresponding to NYC and a desolate part of Mongolia. The intent is to test reverse geocoding in populated and non-populated areas.

### Forward Search in NYC and Des Moines, Iowa
These tests use addresses generated from OpenAddresses data in NYC and Des Mones, Iowa. They test regular forward search performance in populated and relatively less populated areas.

### Forward Structured Search in NYC and Des Moines, Iowa
These tests use the same addresses as the regular forward search tests, and again test search performance in populated and relatively less populated areas, but specifically use the `/v1/search/structured` endpoint.

### Acceptance Test Suite
This test uses all URLs found in the Pelias [acceptance-tests](https://github.com/pelias/acceptance-tests). It therefore has nearly complete coverage of Pelias functionality and hopefully can detect when any obscure type of query has become a large bottleneck.

## TODO:
- Collect output in a way that can be easily fed to more automated tooling
- Allow configuring VUs and duration for test suites
- (the endgame) Automatically run a series of tests at different concurrency levels for each test suite and generate a spreadsheet with graphs of concurrency vs latency and concurrency vs throughput
