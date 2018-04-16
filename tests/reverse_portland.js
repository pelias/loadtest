import http from "k6/http";
import { check } from "k6";

if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

if (!__ENV.API_KEY) {
  console.error("No API_KEY set"); exit(1);
}

const portlandLatLon = [ 45.52, -122.681944 ];

const vu_count = parseInt(__ENV.VU) || 10;
export let options = {
  duration: "30s",
  vus: vu_count
}

function randomInRange(min, max) {
    return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
}

export default function() {
  const latRand = randomInRange(-0.1, 0.1);
  const lonRand = randomInRange(-0.1, 0.1);

  const lat = portlandLatLon[0] + latRand;
  const lon = portlandLatLon[1] + lonRand;

  const url = `${__ENV.HOST}/v1/reverse?point.lat=${lat}&point.lon=${lon}&api_key=${__ENV.API_KEY}&layers=address`;
  let res = http.get(url);

  check(res, {
    "status was 200": (r) => (r.status == 200 || r.status == 304),
    "status was not 429": (r) => (r.status != 429),
    "status was not 401": (r) => (r.status != 401),
    "request time under 200ms": (r) => r.timings.duration < 200
  });
}
