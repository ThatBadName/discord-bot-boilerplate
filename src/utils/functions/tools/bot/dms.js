const { red } = require("colorette")
const logger = require("../logging/logger")

async function createDM(client, id, message) {
  const user = await client.users.fetch(id)

  try {
    user.send(message)
    logger("Info", `DM sent to ${user.id}`)
    return { success: true, error: null }
  }
  catch (error) {
    logger("Warn", `Error when sending DM to ${user.id}: ${red(error.message)}`)
    return { success: false, error: error.message }
  }
}

module.exports = createDM