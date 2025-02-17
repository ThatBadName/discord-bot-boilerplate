var monthNames = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];
var dayOfWeekNames = [
  "Sunday", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday", "Saturday"
];

/**
 *
 * @param {} date A date to format
 * @param {string} patternStr The format as to return the date in (eg: dd/MM/yy @hh:mm:ss)
 * @returns
 */
function formatDate(date = new Date(), patternStr = "dd/MM/yy @HH:mm:ss") {
  var day = date.getUTCDate(),
    month = date.getUTCMonth(),
    year = date.getUTCFullYear(),
    hour = date.getUTCHours(),
    minute = date.getUTCMinutes(),
    second = date.getUTCSeconds(),
    miliseconds = date.getUTCMilliseconds(),
    h = hour % 12,
    hh = twoDigitPad(h),
    HH = twoDigitPad(hour),
    mm = twoDigitPad(minute),
    ss = twoDigitPad(second),
    aaa = hour < 12 ? 'AM' : 'PM',
    EEEE = dayOfWeekNames[date.getDay()],
    EEE = EEEE.substr(0, 3),
    dd = twoDigitPad(day),
    M = month + 1,
    MM = twoDigitPad(M),
    MMMM = monthNames[month],
    MMM = MMMM.substr(0, 3),
    yyyy = year + "",
    yy = yyyy.substr(2, 2)
    ;
  // checks to see if month name will be used
  patternStr = patternStr
    .replace('hh', hh).replace('h', h)
    .replace('HH', HH).replace('H', hour)
    .replace('mm', mm).replace('m', minute)
    .replace('ss', ss).replace('s', second)
    .replace('S', miliseconds)
    .replace('dd', dd).replace('d', day)

    .replace('EEEE', EEEE).replace('EEE', EEE)
    .replace('yyyy', yyyy)
    .replace('yy', yy)
    .replace('aaa', aaa);
  if (patternStr.indexOf('MMM') > -1) {
    patternStr = patternStr
      .replace('MMMM', MMMM)
      .replace('MMM', MMM);
  }
  else {
    patternStr = patternStr
      .replace('MM', MM)
      .replace('M', M);
  }
  return patternStr;
}
function twoDigitPad(num) {
  return num < 10 ? "0" + num : num;
}

module.exports = formatDate