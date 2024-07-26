const config = require("../../../../../config.json");

/**
 *
 * @param {object} user A user object
 * @param {object} guild (Optional) A guild object
 * @returns
 */
function getUserPermissionLevel(user, guild = null) {
  if (config.permissions.owners.includes(user?.id)) return config.permissions.ownerPermissionLevel;
  if (config.permissions.staff.includes(user?.id)) return config.permissions.staffPermissionLevel;

  return config.permissions.defaultPermissionLevel;
}

module.exports = getUserPermissionLevel;
