const { InteractionType } = require("discord.js");
const noButtonCodeMessage = require("../../utils/messages/errors/noButtonCode");
const onUserCooldownMessage = require("../../utils/messages/errors/cooldowns/onUserCooldown");
const onGuildCooldownMessage = require("../../utils/messages/errors/cooldowns/onGuildCooldown");
const cooldown = require("../../utils/functions/tools/bot/cooldown");
const commandRunChecks = require("../../utils/functions/tools/bot/commandRunChecks");
module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(interaction, client) {
    if (interaction.customId?.startsWith("deferMe")) return interaction.deferUpdate();
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      if ((await commandRunChecks(command, interaction)).status == "Failed") return;
      try {
        const cooldownUserCheck = await cooldown(`command_${commandName}-${interaction.user.id}`, command.cooldown);
        if (cooldownUserCheck.isOnCooldown)
          return interaction.reply(
            JSON.parse(JSON.stringify(onUserCooldownMessage).replaceAll(`{{expires}}`, Math.round(cooldownUserCheck.expiresIn / 1000)))
          );

        const cooldownGuildCheck = await cooldown(`command_${commandName}-${interaction.guild?.id}`, command.guildCooldown);
        if (cooldownGuildCheck.isOnCooldown)
          return interaction.reply(
            JSON.parse(JSON.stringify(onGuildCooldownMessage).replaceAll(`{{expires}}`, Math.round(cooldownGuildCheck.expiresIn / 1000)))
          );
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      if (customId.startsWith(`ignoreMe`)) return;
      const button = buttons.get(customId.split(":")[0]);
      if (!button) return interaction.reply(noButtonCodeMessage);
      if ((await commandRunChecks(button, interaction)).status == "Failed") return;

      try {
        const cooldownUserCheck = await cooldown(`button_${customId.split(":")[0]}-${interaction.user.id}`, button.cooldown);
        if (cooldownUserCheck.isOnCooldown)
          return interaction.reply(
            JSON.parse(JSON.stringify(onUserCooldownMessage).replaceAll(`{{expires}}`, Math.round(cooldownUserCheck.expiresIn / 1000)))
          );

        const cooldownGuildCheck = await cooldown(`button_${customId.split(":")[0]}-${interaction.guild?.id}`, button.guildCooldown);
        if (cooldownGuildCheck.isOnCooldown)
          return interaction.reply(
            JSON.parse(JSON.stringify(onGuildCooldownMessage).replaceAll(`{{expires}}`, Math.round(cooldownGuildCheck.expiresIn / 1000)))
          );
        await button.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const contextCommand = commands.get(commandName);
      if (!contextCommand) return;

      if ((await commandRunChecks(contextCommand, interaction)).status == "Failed") return;

      try {
        const cooldownUserCheck = await cooldown(`contextCommand_${commandName}-${interaction.user.id}`, contextCommand.cooldown);
        if (cooldownUserCheck.isOnCooldown)
          return interaction.reply(
            JSON.parse(JSON.stringify(onUserCooldownMessage).replaceAll(`{{expires}}`, Math.round(cooldownUserCheck.expiresIn / 1000)))
          );

        const cooldownGuildCheck = await cooldown(`contextCommand_${commandName}-${interaction.guild?.id}`, contextCommand.guildCooldown);
        if (cooldownGuildCheck.isOnCooldown)
          return interaction.reply(
            JSON.parse(JSON.stringify(onGuildCooldownMessage).replaceAll(`{{expires}}`, Math.round(cooldownGuildCheck.expiresIn / 1000)))
          );

        await contextCommand.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (
      interaction.isStringSelectMenu() ||
      interaction.isRoleSelectMenu() ||
      interaction.isChannelSelectMenu() ||
      interaction.isUserSelectMenu()
    ) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const menu = selectMenus.get(customId.split(":")[0]);
      if (!menu) return new Error("This menu has not got any code");
      if ((await commandRunChecks(menu, interaction)).status == "Failed") return;

      try {
        const cooldownUserCheck = await cooldown(`menu_${customId.split(":")[0]}-${interaction.user.id}`, menu.cooldown);
        if (cooldownUserCheck.isOnCooldown)
          return interaction.reply(
            JSON.parse(JSON.stringify(onUserCooldownMessage).replaceAll(`{{expires}}`, Math.round(cooldownUserCheck.expiresIn / 1000)))
          );

        const cooldownGuildCheck = await cooldown(`menu_${customId.split(":")[0]}-${interaction.guild?.id}`, menu.guildCooldown);
        if (cooldownGuildCheck.isOnCooldown)
          return interaction.reply(
            JSON.parse(JSON.stringify(onGuildCooldownMessage).replaceAll(`{{expires}}`, Math.round(cooldownGuildCheck.expiresIn / 1000)))
          );

        await menu.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.autocomplete(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId.split(":")[0]);
      if (!modal) return;

      try {
        await modal.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    }
  },
};
