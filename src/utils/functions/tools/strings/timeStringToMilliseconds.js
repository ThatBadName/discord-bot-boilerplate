/**
 *
 * @param {string} timeString A string to turn into milliseconds, for example: 1d3h
 * @returns {number} The time string that was parsed, in milliseconds
 */

function timeStringToMilliseconds(timeString) {
  const timeUnits = {
    y: 356 * 7 * 24 * 60 * 60 * 1 * 1000,
    w: 7 * 24 * 60 * 60 * 1 * 1000,
    d: 24 * 60 * 60 * 1 * 1000,
    h: 60 * 60 * 1 * 1000,  // 1 hour = 3600000 ms
    m: 60 * 1 * 1000,    // 1 minute = 60000 ms
    s: 1 * 1000,     // 1 second = 1000 ms
  };

  // Regular expression to match the time units in the string
  const regex = /(\d+)(y|yr|mo|w|d|hr|h|m|s|ms)/g;
  let totalMilliseconds = 0;
  let match;

  // Loop through all matches of the regex
  while ((match = regex.exec(timeString.toLowerCase())) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];
    totalMilliseconds += value * timeUnits[unit];
  }

  return totalMilliseconds;
}

module.exports = timeStringToMilliseconds