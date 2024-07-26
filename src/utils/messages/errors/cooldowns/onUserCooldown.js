const config = require('../../../../../config.json')

module.exports = {
  embeds: [
    {
      color: parseInt(config.assets.colours.primary, 16),
      description: `### ${config.assets.emojis.clock} You are on cooldown, try again <t:{{expires}}:R>`
    }
  ],
  ephemeral: true,
  tts: false
}