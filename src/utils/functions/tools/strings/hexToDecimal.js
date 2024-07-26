/**
 *
 * @param {string} hexColor A hex colour string, the # is not required
 * @returns {number} The hex colour as a decimal one
 */

function hexToDecimal(hexColor) {
  // Remove the leading '#' if it exists
  if (hexColor.startsWith('#')) {
    hexColor = hexColor.slice(1);
  }
  // Convert the hex string to a decimal number
  const decimalNumber = parseInt(hexColor, 16);
  return decimalNumber;
}

module.exports = hexToDecimal