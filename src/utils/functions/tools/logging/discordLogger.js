async function discordLog(
  client,
  guildId,
  channelId,
  message
) {
  const guild = await client.guilds.fetch(guildId)
  if (!guild) return { sent: false, error: "No guild" }
  const channel = await guild.channels.fetch(channelId)
  if (!channel) return { sent: false, error: "No channel" }

  try {
    channel.send(message)
    return { sent: true, error: null }
  }
  catch {
    return { sent: false, error: "Couldn't send message" }
  }
}

module.exports = discordLog