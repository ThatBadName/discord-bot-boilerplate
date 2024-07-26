const fs = require('fs')
const logger = require('./logger')
const AsyncFileHandler = require('../../../classes/FileHandler')

async function incrementLogId() {
  const logIdFileExists = await AsyncFileHandler.exists(`./database/counters/logs`);
  const current = logIdFileExists ? parseInt((await AsyncFileHandler.read(`./database/counters/logs`)).contents) : 0;
  if (logIdFileExists) await AsyncFileHandler.write(`./database/counters/logs`, String(current + 1));
  logger("Logging", `Log ID has been set to ${current + (logIdFileExists ? 1 : 0)}`)
}

module.exports = incrementLogId