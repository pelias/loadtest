import http from "k6/http";

import { check } from "k6";


if (!__ENV.HOST) {
  __ENV.HOST = "http://pelias.dev.mapzen.com";
}

if (!__ENV.API_KEY) {
  console.error("No API_KEY set");
  exit(1);
}

import data from './data.js'

const vu_count = 60;

export let options = {
  duration: "30s",
  vus: vu_count
}


//      "pelias.dev.mapzen.com": "mapzen-dMVuEs8",
//-91.1342882,40.8051312,2729,REGINA DRIVE,,BURLINGTON,,,,0,f411c9641d18544f
//-91.105531,40.8044714,412,S 5TH STREET,,BURLINGTON,,,,71,66bdb4f00585e922
export default function() {
  const data_index = (vu_count * __ITER + __VU) % data.data.length;
  //console.log(`COUNT: ${vu_count}, VU: ${__VU}, ITER: ${__ITER}, length: ${data.data.length}, index: ${data_index}`);

  const data_row = data.data[data_index];

  const address = `${data_row['NUMBER']}+${data_row['STREET'].replace(/ /g, '+')}`;
  const locality = "new+york";//data_row['CITY'].replace(/ /g, '+');

  // full query
  const query = `/v1/search/structured?address=${address}&locality=${locality}&region=new+york&country=usa`
  //only address and locality
  //const query = `/v1/search/structured?address=${address}&locality=${locality}`

  const url = `${__ENV.HOST}${query}&api_key=${__ENV.API_KEY}`;
  let res = http.get(url);

  //if (res.status !== 200) {
    //console.log(res.status);
  //}

  check(res, {
    "status was 200": (r) => (r.status == 200 || r.status == 304),
    "status was not 429": (r) => (r.status != 429),
    "status was not 401": (r) => (r.status != 401),
    "request time under 200ms": (r) => r.timings.duration < 200
  });
}
