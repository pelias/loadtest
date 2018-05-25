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

export default function() {

  const url = `${__ENV.HOST}/v1`;
  let res = http.get(url);

  check(res, {
    "status was 200 or 429": (r) => (r.status == 200 || r.status == 429),
    "status was 200": (r) => (r.status == 200),
    "status was not 429": (r) => (r.status !== 429),
    "request time under 200ms": (r) => r.timings.duration < 200,
    "request time under 100ms": (r) => r.timings.duration < 100
  });
}
