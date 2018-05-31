import http from "k6/http";
import { check } from "k6";

if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

if (!__ENV.API_KEY) {
  __ENV.API_KEY="";
}

import data from '../generated_data/nyc_oa.js'

const vu_count = parseInt(__ENV.VU) || 10;
export let options = {
  duration: "30s",
  vus: vu_count
}

function randomInRange(min, max) {
    return Math.random() * (max-min) + min;
}

const nycLatLon = [ 40.7308, -73.9356 ];

export default function() {
  const data_index = (vu_count * __ITER + __VU) % data.data.length;

  const latRand = randomInRange(-0.1, 0.1);
  const lonRand = randomInRange(-0.1, 0.1);

  const lat = nycLatLon[0] + latRand;
  const lon = nycLatLon[1] + lonRand;

  const data_row = data.data[data_index];
  const address = `${data_row['NUMBER']}+${data_row['STREET'].replace(/ /g, '+')}`;
  const locality = "new+york";

  const query = `/v1/search?text=${address},+${locality},+ny,+usa&focus.point.lat=${lat}&focus.point.lon=${lon}`

  const url = `${__ENV.HOST}${query}&api_key=${__ENV.API_KEY}`;
  let res = http.get(url);

  check(res, {
    "status was 200": (r) => (r.status == 200 || r.status == 304),
    "status was not 429": (r) => (r.status != 429),
    "status was not 401": (r) => (r.status != 401),
    "request time under 100ms": (r) => r.timings.duration < 100,
    "request time under 200ms": (r) => r.timings.duration < 200
  });
}
