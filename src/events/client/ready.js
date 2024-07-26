const logger = require("../../utils/functions/tools/logging/logger");
const clearCooldowns = require("../../utils/functions/tools/startup/clearCooldowns");
module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    // Startup script
    logger("Startup", "Running startup scripts");
    clearCooldowns();
    logger("Info", `${client.user.username} is now online`);
  },
};
