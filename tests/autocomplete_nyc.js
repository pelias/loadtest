import http from "k6/http";
import { check } from "k6";

if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

if (!__ENV.API_KEY) {
  console.error("No API_KEY set"); exit(1);
}

import data from '../generated_data/nyc_oa.js'

const vu_count = parseInt(__ENV.VU) || 10;
export let options = {
  duration: "30s",
  vus: vu_count
}

function getRandomInt(max) {
    return
}

export default function() {
  const data_index = (vu_count * __ITER + __VU) % data.data.length;

  const data_row = data.data[data_index];
  const address = `${data_row['NUMBER']}+${data_row['STREET'].replace(/ /g, '+')}`;
  const locality = "new+york";
  const full_input =`${address},+${locality},+ny,+usa`
  const length = Math.floor(Math.random() * Math.floor(full_input.length));
  const input = full_input.substring(0, length);

  const query = `/v1/autocomplete?text=${input}`

  const url = `${__ENV.HOST}${query}`;
  let res = http.get(url);

  check(res, {
    "status was 200": (r) => (r.status == 200 || r.status == 304),
    "status was not 429": (r) => (r.status != 429),
    "status was not 401": (r) => (r.status != 401),
    "request time under 200ms": (r) => r.timings.duration < 200,
    "request time under 100ms": (r) => r.timings.duration < 100
  });
}

