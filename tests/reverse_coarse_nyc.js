import http from "k6/http";
import { check } from "k6";

if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

if (!__ENV.API_KEY) {
  console.error("No API_KEY set"); exit(1);
}

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
  const latRand = randomInRange(-0.1, 0.1);
  const lonRand = randomInRange(-0.1, 0.1);

  const lat = nycLatLon[0] + latRand;
  const lon = nycLatLon[1] + lonRand;

  const url = `${__ENV.HOST}point.lat=${lat}&point.lon=${lon}&layers=coarse&api_key=${__ENV.API_KEY}`;
  let res = http.get(url);

  check(res, {
    "status was 200": (r) => (r.status == 200 || r.status == 304),
    "status was not 429": (r) => (r.status != 429),
    "status was not 401": (r) => (r.status != 401),
    "request time under 200ms": (r) => r.timings.duration < 200
  });
}
