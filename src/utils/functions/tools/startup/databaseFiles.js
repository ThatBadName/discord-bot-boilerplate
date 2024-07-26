const fs = require("fs");
const logger = require("../logging/logger");
const requiredFiles = [
  { path: "cooldowns/" },
  { path: "modules.json", content: "[]" },
  { path: "counters/" },
  { path: "counters/logs", content: "0" },
  { path: "guilds/" },
  { path: "users/" },
];

/**
 * @description If any local database files have gone missing, create them
 */
function createAllMissingDatabaseFiles() {
  logger("Startup", `Creating missing database files`);
  if (!fs.existsSync("./database")) fs.mkdirSync("./database");
  for (const file of requiredFiles) {
    if (fs.existsSync(`./database/${file.path}`)) continue;
    logger("Startup", `Creating database file: ${file.path}`);
    if (file.path.endsWith("/")) {
      fs.mkdirSync(`./database/${file.path}`);
      continue;
    } else {
      fs.writeFileSync(`./database/${file.path}`, file.content);
    }
  }
  logger("Startup", `Database files created`);
}

module.exports = createAllMissingDatabaseFiles;
