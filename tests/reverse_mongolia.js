import http from "k6/http";
import { check } from "k6";

if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

if (!__ENV.API_KEY) {
  __ENV.API_KEY="";
}

const vu_count = parseInt(__ENV.VU) || 10;
export let options = {
  duration: "30s",
  vus: vu_count
}

function randomInRange(min, max) {
    return Math.random() * (max-min) + min;
}

const centerLatLon = [ 47.916667, 106.883333 ];

export default function() {
  const latRand = randomInRange(-0.1, 0.1);
  const lonRand = randomInRange(-0.1, 0.1);

  const lat = centerLatLon[0] + latRand;
  const lon = centerLatLon[1] + lonRand;

  const url = `${__ENV.HOST}/v1/reverse?point.lat=${lat}&point.lon=${lon}&api_key=${__ENV.API_KEY}`;
  let res = http.get(url);

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
