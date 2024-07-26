const cooldownPath = "./database/cooldowns";
const fs = require("fs");
const AsyncFileHandler = require("../../../classes/FileHandler");

/**
 *
 * @param {string} key The unique key for the cooldown
 * @param {number} timeout The timeout in ms
 * @returns
 */
async function cooldown(key, timeout, cancel = false) {
  if (cancel) {
    if (await AsyncFileHandler.exists(`${cooldownPath}/${key}`)) await AsyncFileHandler.delete(`${cooldownPath}/${key}`);
    return true;
  }
  if (timeout == 0 || timeout == null)
    return {
      isOnCooldown: false,
      key,
      expiresIn: -1,
    };
  if (await AsyncFileHandler.exists(`${cooldownPath}/${key}`)) {
    const expiresIn = parseInt(fs.readFileSync(`${cooldownPath}/${key}`, "utf-8"));
    if (expiresIn <= new Date()) {
      const date = new Date();
      const expires = date.setMilliseconds(date.getMilliseconds() + timeout);
      await AsyncFileHandler.write(`${cooldownPath}/${key}`, String(expires));
      setTimeout(async () => {
        if (await AsyncFileHandler.exists(`${cooldownPath}/${key}`)) await AsyncFileHandler.delete(`${cooldownPath}/${key}`);
      }, timeout);
      return {
        isOnCooldown: false,
        key,
        expiresIn: -1,
      };
    }
    return {
      isOnCooldown: true,
      key,
      expiresIn,
    };
  }

  const date = new Date();
  const expires = date.setMilliseconds(date.getMilliseconds() + timeout);
  await AsyncFileHandler.write(`${cooldownPath}/${key}`, String(expires));
  setTimeout(async () => {
    if (await AsyncFileHandler.exists(`${cooldownPath}/${key}`)) await AsyncFileHandler.delete(`${cooldownPath}/${key}`);
  }, timeout);
  return {
    isOnCooldown: false,
    key,
    expiresIn: -1,
  };
}

module.exports = cooldown;
