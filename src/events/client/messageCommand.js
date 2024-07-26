const onUserCooldownMessage = require("../../utils/messages/errors/cooldowns/onUserCooldown");
const onGuildCooldownMessage = require("../../utils/messages/errors/cooldowns/onGuildCooldown");
const cooldown = require("../../utils/functions/tools/bot/cooldown");
const commandRunChecks = require("../../utils/functions/tools/bot/commandRunChecks");

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message, client) {
    const { commands } = client;
    const commandName = message.content.replace(`<@${client.user.id}>`, "").replace(client.config.bot.prefix, "").split(" ")[0];

    const command = await commands.get(commandName);
    if (!message.content.startsWith(`<@${client.user.id}>`) && !message.content.startsWith(client.config.bot.prefix)) return;
    if (!command) return;
    if (message.author.bot) return;
    if (command.owner && !client.config.permissions.owners.includes(message.author.id)) return;
    if (command.testGuild && process.env.TEST_SERVER_ID != message.guild.id) return;
    if (!message.guild && !command.allowDm) return;
    if ((await commandRunChecks(command, message)).status == "Failed") return;
    const args = message.content.replace(`<@${client.user.id}>`, "").replace(client.config.bot.prefix, "").split(" ").slice(1);

    try {
      const cooldownUserCheck = await cooldown(`command_${commandName}-${message.author.id}`, command.cooldown);
      if (cooldownUserCheck.isOnCooldown)
        return message.reply(
          JSON.parse(JSON.stringify(onUserCooldownMessage).replaceAll(`{{expires}}`, Math.round(cooldownUserCheck.expiresIn / 1000)))
        );

      const cooldownGuildCheck = await cooldown(`command_${commandName}-${message.author.id}`, command.guildCooldown);
      if (cooldownGuildCheck.isOnCooldown)
        return message.reply(
          JSON.parse(JSON.stringify(onGuildCooldownMessage).replaceAll(`{{expires}}`, Math.round(cooldownGuildCheck.expiresIn / 1000)))
        );

      await command.message(message, args, client);
    } catch (error) {
      console.error(error);
    }
  },
};
