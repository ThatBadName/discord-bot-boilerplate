const { ShardingManager } = require("discord.js");
const logger = require("./utils/functions/tools/logging/logger");
const incrementLogId = require("./utils/functions/tools/logging/incrementLogId");
const createAllMissingDatabaseFiles = require("./utils/functions/tools/startup/databaseFiles");
require("dotenv").config();
incrementLogId();
createAllMissingDatabaseFiles();

let manager = new ShardingManager("./src/bot.js", {
  token: process.env.TOKEN,
  totalShards: "auto",
  respawn: true,
});

manager.on("shardCreate", async shard => {
  logger("Sharding", `Launched shard ${shard.id}`);
});

manager.spawn();
