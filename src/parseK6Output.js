function mapTimingKeys(key) {
  if (key === 'p(90)') {
    return 'p99';
  } else if (key === 'p(95)') {
    return 'p95';
  } else {
    return key;
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
function round(number, precision) {
  var factor = Math.pow(10, precision);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};


// parse an actual duration value given by K6, which may be in milliseconds or seconds
// this will always return a floating point value in seconds
// values are rounded to hundreths of a milisecond (6 decimal places)
function parseDuration(time) {
  const raw_float = parseFloat(time);
  let seconds = raw_float;

  if (time[time.length-2] === 'm') { //value is in miliseconds
    seconds = raw_float / 1000.0
  }

  return round(seconds, 6);
}


function getTimingLineValues(line) {
  // find sections of the line that correspond to timing values. Each section is space delimited with an equals sign in the middle
  const timingValueStrings = line.split(' ').filter(part => part.match('\='));

  return timingValueStrings.reduce((accumulator, part) => {
    const sections = part.split("\=");
    accumulator[mapTimingKeys(sections[0])] = parseDuration(sections[1]);
    return accumulator;
  }, {});
}

function parseDurationLine(line) {
  // find the line that includes the values we want and send it off to be parsed
  if (line.match('http_req_duration')) {
    return getTimingLineValues(line);
  }
}

module.exports = function parseK6Output(textInput) {
  const result = {};

  // check each line to see if it includes one of the types of values we care about
  // assume each type of value will only be in the output once
  textInput.split('\n').forEach((line) => {
    result.duration = parseDurationLine(line) || result.duration;
  });
  return result;
}
