import http from "k6/http";
import { check } from "k6";

if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

const vu_count = parseInt(__ENV.VU) || 10;
export let options = {
  duration: "30s",
  vus: vu_count
}

function randomInRange(min, max) {
    return Math.random() * (max-min) + min;
}

//const lat = randomInRange(-90, 90);
//const lon = randomInRange(-180, 180);

// london
//const lat = 51;
//const lon = 0;

//portland
const lat = 45.5;
const lon = -122.5;

export default function() {
  const url = `${__ENV.HOST}/${lon}/${lat}`;
  let res = http.get(url);

  check(res, {
    "status was 200": (r) => (r.status == 200 || r.status == 304),
    "request time under 100ms": (r) => r.timings.duration < 100,
    "request time under 200ms": (r) => r.timings.duration < 200
  });
}
