const getUserPermissionLevel = require("./getUserPermissionLevel");
const missingPermissions = require("../../../messages/errors/missingPermissions");

/**
 *
 * @param {object} command The command/button/select menu that has been used
 * @param {object} interactionOrMessage Something that the bot is able to reply to
 * @returns
 */
async function commandRunChecks(command, interactionOrMessage) {
 if (command.componentOwnerOnly && interactionOrMessage.user.id != interactionOrMessage.message.interaction.user.id) {
    interactionOrMessage.reply(missingPermissions);
    return { status: "Failed", message: "Not your component" };
  } else if (
    getUserPermissionLevel(
      interactionOrMessage.member || interactionOrMessage.user || interactionOrMessage.author,
      interactionOrMessage.guild || null
    ) < command.permissionLevel
  ) {
    interactionOrMessage.reply(missingPermissions);
    return { status: "Failed", message: "Permission level too low" };
  }

  return { status: "Passed", message: "Command checks have all passed" };
}

module.exports = commandRunChecks;
