/**
 *
 * @param {number} colour The colour to verify, should be a decimal colour like 16777215
 */
function validateColour(colour) {
  // Check if the input is a number and within the range of 24-bit RGB colors
  if (typeof colour === 'number' && Number.isInteger(colour) && colour >= 0 && colour <= 16777215) {
    return true;
  }
  return false;
}

module.exports = validateColour