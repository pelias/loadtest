import http from "k6/http";
import { check } from "k6";

if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

if (!__ENV.API_KEY) {
  __ENV.API_KEY="";
}

const constTopUsCities = [
  {"city":"New York City, NY", "centroid": [40.712775, -74.005973] },
  {"city":"Los Angeles, CA","centroid":[34.052234, -118.243685]},
  {"city":"Chicago, IL","centroid":[41.878114, -87.629798]},
  {"city":"Houston, TX","centroid":[29.760427, -95.369803]},
  {"city":"Philadelphia, PA","centroid":[39.952584, -75.165222]},
  {"city":"Phoenix, AZ","centroid":[33.448377, -112.074037]},
  {"city":"San Antonio, TX","centroid":[29.424122, -98.493628]},
  {"city":"San Diego, CA","centroid":[32.715738, -117.161084]},
  {"city":"Dallas, TX","centroid":[-117.161084, -96.796988]},
  {"city":"San Jose, CA","centroid":[37.338208, -121.886329]}
]

// non-China, non-Us
const constTopWorldCities = [
  {"city":"Tokyo, Japan","centroid":[35.689487, 139.691706]},
  {"city":"Delhi, India","centroid":[28.704059, 77.102490]},
  {"city":"Sao Paulo","centroid":[-23.550520, -46.633309]},
  {"city":"Mumbai, India","centroid":[19.075984, 72.877656]},
  {"city":"Mexico City","centroid":[19.432608, -99.133208]},
  {"city":"Osaka, Japan","centroid":[34.693738, 135.502165]},
  {"city":"Cairo, Egypt","centroid":[30.044420, 31.235712]},
  {"city":"Dhaka, Bangladesh","centroid":[23.810332, 90.412518]},
  {"city":"Karachi, Pakistan","centroid":[24.860734, 67.001136]},
  {"city":"Buenos Aires, Argentina","centroid":[-34.603684, -58.381559]}
]


const constTopCities = constTopUsCities.concat(constTopWorldCities);

const vu_count = parseInt(__ENV.VU) || 10;
export let options = {
  duration: "30s",
  vus: vu_count
}

function randomInRange(min, max) {
    return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
}

export default function() {
  const centroidRand = constTopCities[Math.floor(Math.random()*constTopUsCities.length)]["centroid"];
  const latRand = randomInRange(-0.1, 0.1);
  const lonRand = randomInRange(-0.1, 0.1);

  const lat = centroidRand[0] + latRand;
  const lon = centroidRand[1] + lonRand;

  const url = `${__ENV.HOST}/v1/reverse?point.lat=${lat}&point.lon=${lon}&api_key=${__ENV.API_KEY}&layers=address`;
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
