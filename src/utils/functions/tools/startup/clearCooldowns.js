const fs = require("fs");
const logger = require("../logging/logger");

/**
 * @description Clears all expired cooldowns that may not have been deleted
 */
function clearCooldowns() {
  logger("Startup", "Clearing expired cooldowns");
  if (!fs.existsSync(`./database/cooldowns`))
    return logger("Startup", `No cooldowns to delete`);
  let totalDeleted = 0;
  for (const cooldown of fs.readdirSync(`./database/cooldowns`, "utf-8")) {
    if (
      parseInt(fs.readFileSync(`./database/cooldowns/${cooldown}`, "utf-8")) <=
      new Date()
    ) {
      fs.rmSync(`./database/cooldowns/${cooldown}`, { recursive: true });
      totalDeleted += 1;
    }
  }
  logger("Startup", `Expired cooldowns have been deleted (${totalDeleted})`);
}

module.exports = clearCooldowns;
