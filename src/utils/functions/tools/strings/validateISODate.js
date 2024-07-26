/**
 *
 * @param {string} dateString A string to check against an ISO date format
 * @returns
 */
function validateISODate(dateString) {
  // Regular expression to match the ISO 8601 date format
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return isoDatePattern.test(dateString);
}