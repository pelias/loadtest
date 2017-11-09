import http from "k6/http";
import { check } from "k6";

if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

if (!__ENV.API_KEY) {
  console.error("No API_KEY set"); exit(1);
}

import data from '../generated_data/nyc_oa.js'

const vu_count = 60;
export let options = {
  duration: "30s",
  vus: vu_count
}

export default function() {
  const data_index = (vu_count * __ITER + __VU) % data.data.length;

  const data_row = data.data[data_index];
  const address = `${data_row['NUMBER']}+${data_row['STREET'].replace(/ /g, '+')}`;
  const locality = "new+york";//data_row['CITY'].replace(/ /g, '+');

  const query = `/v1/search/structured?address=${address}&locality=${locality}&region=new+york&country=usa`

  const url = `${__ENV.HOST}${query}&api_key=${__ENV.API_KEY}`;
  let res = http.get(url);

  check(res, {
    "status was 200": (r) => (r.status == 200 || r.status == 304),
    "status was not 429": (r) => (r.status != 429),
    "status was not 401": (r) => (r.status != 401),
    "request time under 200ms": (r) => r.timings.duration < 200
  });
}
