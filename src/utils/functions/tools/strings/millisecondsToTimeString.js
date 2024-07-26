/**
 *
 * @param {number} milliseconds Milliseconds to convert into a time string
 * @returns {string} The milliseconds as a time string (eg: 1d3h)
 */

function millisecondsToTimeString(milliseconds) {
  const timeUnits = [
    { unit: 'y', value: 356 * 7 * 24 * 60 * 60 * 1 * 1000 },
    { unit: 'w', value: 7 * 24 * 60 * 60 * 1 * 1000 },
    { unit: 'd', value: 24 * 60 * 60 * 1 * 1000 },
    { unit: 'h', value: 60 * 60 * 1 * 1000 },
    { unit: 'm', value: 60 * 1 * 1000 },
    { unit: 's', value: 1 * 1000 },
  ];

  let remainingMilliseconds = milliseconds;
  let timeString = '';

  for (const { unit, value } of timeUnits) {
    const unitCount = Math.floor(remainingMilliseconds / value);
    if (unitCount > 0) {
      timeString += `${unitCount}${unit}`;
      remainingMilliseconds -= unitCount * value;
    }
  }

  return timeString;
}

module.exports = millisecondsToTimeString