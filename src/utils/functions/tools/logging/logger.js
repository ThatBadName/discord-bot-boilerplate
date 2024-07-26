const { dim, blue, magenta, white, red, yellow, yellowBright } = require("colorette");
const formatDate = require("./timeFormat");
const fs = require("fs");
const AsyncFileHandler = require("../../../classes/FileHandler");

/**
 *
 * @param {string} type The type of log
 * @param  {...string} message The message to log
 */
async function logger(type, ...message) {
  if (!(await AsyncFileHandler.exists(`./logs`))) await AsyncFileHandler.createDirectory(`./logs`);
  const currentLogId = (await AsyncFileHandler.exists(`./database/counters/logs`))
    ? (await AsyncFileHandler.read(`./database/counters/logs`)).contents
    : 0;
  const currentLog = (await AsyncFileHandler.exists(`./logs/${currentLogId}.log`))
    ? (await AsyncFileHandler.read(`./logs/${currentLogId}.log`)).contents
    : "";
  const logMessage = `[ ${formatDate()} ][ ${type} ] ${message.join(" ")}`;
  const logMessageFormatted = `${dim("[ ")}${magenta(formatDate())}${dim(" ]")}${dim("[ ")}${specialColours(type)}${dim(" ]")} ${white(
    message.join(" ")
  )}`;
  console.log(logMessageFormatted);
  await AsyncFileHandler.write(`./logs/${currentLogId}.log`, `${currentLog + logMessage + "\n"}`);
}

function specialColours(type) {
  switch (type) {
    case "Error":
      return red(type);
    case "Info":
      return yellowBright(type);
    case "Warn":
      return yellow(type);
    default:
      return blue(type);
  }
}

module.exports = logger;
