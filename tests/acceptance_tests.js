import http from "k6/http";
import { check } from "k6";

if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

if (!__ENV.API_KEY) {
  console.error("No API_KEY set"); exit(1);
}

import data from '../generated_data/acceptance_tests.js'

const vu_count = 20;
export let options = {
  duration: "30s",
  vus: vu_count
}

export default function() {
  const data_index = (vu_count * __ITER + __VU) % data.data.length;

  const query = data.data[data_index];

  const url = `${__ENV.HOST}${query}&api_key=${__ENV.API_KEY}`;
  let res = http.get(url);

  check(res, {
    "status was 200": (r) => (r.status == 200 || r.status == 304),
    "status was not 429": (r) => (r.status != 429),
    "status was not 401": (r) => (r.status != 401),
    "request time under 200ms": (r) => r.timings.duration < 200
  });
}
