/**
 *
 * @param {string} string The string to truncate
 * @param {number} maxLength The maximum amount of characters in the string to return
 * @param {boolean} addSuffix Should the "..." suffix be added
 * @returns The modified string
 */

function truncateString(string, maxLength, addSuffix = true) {
  if (string.length > maxLength) {
    if (addSuffix) {
      return string.slice(0, maxLength - 3) + '...';
    }
    return string.slice(0, maxLength);
  }
  return string;
}

module.exports = truncateString