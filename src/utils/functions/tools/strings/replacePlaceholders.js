/**
 * Function to replace placeholders in a string with values from a given object.
 * @param {string} template - The string containing placeholders in the format {{key}}.
 * @param {object} data - The object containing values to replace placeholders.
 * @returns {string} - The string with replaced values.
 */
function replacePlaceholders(template, data, options = {}) {
  // Destructure options with defaults
  const {
    prefix = '{{',
    suffix = '}}',
    arrayPattern = '\\[\\d+\\]',
    defaultPattern = '\\w+',
    unfoundKeyReplacement = "{{match}}"
  } = options;

  // Create the dynamic regex pattern based on the given prefix and suffix
  const pattern = new RegExp(
    `${prefix}((${defaultPattern}(\\.${defaultPattern}|${arrayPattern})*))${suffix}`,
    'g'
  );

  return template.replaceAll(pattern, (match, key) => {
    const keys = key.split(/\.|\[|\]\.?/).filter(Boolean);
    let value = data;

    // Traverse the object to get the value
    for (const part of keys) {
      if (value && value.hasOwnProperty(part)) {
        value = value[part];
      } else if (Array.isArray(value) && part.match(/^\d+$/)) {
        value = value[parseInt(part)];
      } else {
        return unfoundKeyReplacement.replaceAll(`${prefix}match${suffix}`, match).replaceAll(`${prefix}rawMatch${suffix}`, match.replaceAll(prefix, "").replaceAll(suffix, "")); // Key not found, return the match itself
      }
    }

    return value !== undefined ? value : unfoundKeyReplacement.replaceAll(`${prefix}match${suffix}`, match).replaceAll(`${prefix}rawMatch${suffix}`, match.replaceAll(prefix, "").replaceAll(suffix, ""));
  });
}

module.exports = replacePlaceholders