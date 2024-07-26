const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const logger = require("../utils/functions/tools/logging/logger");

module.exports = async function loadCommands(client, path, config) {
  const commandFolders = fs.readdirSync(`./src/commands`);
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"));

    const { commands, globalCommandArray, localCommandArray } = client;
    for (const file of commandFiles) {
      let command = require(`../commands/${folder}/${file}`);
      command = {
        testGuild: command.testGuild || false,
        permissionLevel: command.permissionLevel || 1,
        hide: command.hide || false,
        module: command.module,
        aliases: command.aliases || [],
        cooldown: command.cooldown || 0,
        guildCooldown: command.guildCooldown || 0,
        permissions: command.permissions || [0],
        slash: command.slash,
        allowDm: command.data.dm_permission,
        data: command.data,
        execute: command.execute || command.interaction,
        message: command.message,
        autocomplete: command.autocomplete,
        enabled: command.enabled || true,
      };
      commands.set(command.data.name, command);
      for (const alias of command.aliases) {
        commands.set(alias, command);
      }
      if (command.slash === true || command.slash === "both" || command.slash === undefined) {
        if (command.testOnly === true) {
          localCommandArray.push(command.data.toJSON());
        } else {
          globalCommandArray.push(command.data.toJSON());
        }
      }
    }
  }

  const rest = new REST({
    version: "10",
  }).setToken(process.env.TOKEN);
  try {
    logger("Global Handler", `Started refreshing (/) commands`);

    if (client.globalCommandArray.length >= 0)
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: client.globalCommandArray,
      });
    logger("Global Handler", `Successfully reloaded (/) commands`);
    logger("Local Handler", `Started refreshing (/) commands`);

    if (client.localCommandArray.length >= 0)
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_SERVER_ID), {
        body: client.localCommandArray,
      });

    logger("Local Handler", `Successfully reloaded (/) commands`);
  } catch (error) {
    console.error(error);
  }
};
