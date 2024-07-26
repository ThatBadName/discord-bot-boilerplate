const emojiRegex = require('emoji-regex');
const regex = emojiRegex();

/**
 *
 * @param {string} string
 * @param {number} limit
 * @returns {string[]}
 */
module.exports = function extractEmojis(string, limit = 1) {
  const matches = []
  for (const match of string.matchAll(regex)) {
    if (limit == 0) break
    limit--
    matches.push(match[0])
  }
  return matches
}