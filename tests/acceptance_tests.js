import http from "k6/http";
import { check } from "k6";

if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

if (!__ENV.API_KEY) {
  __ENV.API_KEY="";
}

import data from '../generated_data/acceptance_tests.js'

const vu_count = parseInt(__ENV.VU) || 10;
export let options = {
  duration: "30s",
  vus: vu_count
}

export default function() {
  const data_index = (vu_count * __ITER + __VU) % data.data.length;

  const query = data.data[data_index];

  const url = `${__ENV.HOST}${query}&api_key=${__ENV.API_KEY}`;
  let res = http.get(url);

  if (res.status != 200  && res.status != 429) {
    console.log(`status ${res.status}`);
    console.log(url);
    console.log();
  }

  check(res, {
    "request time under 100ms": (r) => r.timings.duration < 100,
    "request time under 200ms": (r) => r.timings.duration < 200,
    "status was 200 or 429": (r) => (r.status == 200 || r.status == 429),
    "status was 200": (r) => (r.status == 200 || r.status == 304),
    "status was not 401": (r) => (r.status != 401),
    "status was not 408": (r) => (r.status != 408),
    "status was not 429": (r) => (r.status != 429),
    "status was not 5xx": (r) => (r.status < 500 || r.status >= 600)
  });
}
