import http from "k6/http";
import { check } from "k6";

if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

if (!__ENV.API_KEY) {
  __ENV.API_KEY="";
}

export default function() {
  const url = `${__ENV.HOST}/v1/place?api_key=${__ENV.API_KEY}&ids=whosonfirst%3Alocality%3A10175036`;

  let res = http.get(url);

  check(res, {
    "status was 200": (r) => (r.status == 200 || r.status == 304),
    "status was not 429": (r) => (r.status != 429),
    "status was 200 or 429": (r) => (r.status == 200 || r.status == 429),
    "status was not 401": (r) => (r.status != 401),
    "request time under 200ms": (r) => r.timings.duration < 200
  });
}
