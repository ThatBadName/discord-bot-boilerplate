/**
 *
 * @param {string} url A possible url to check
 */

function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = validateURL