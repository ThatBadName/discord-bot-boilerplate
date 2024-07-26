const config = require('../../../../config.json')

module.exports = {
  embeds: [
    {
      color: parseInt(config.assets.colours.primary, 16),
      description: `### ${config.assets.emojis.warn} Something went wrong`
    }
  ],
  ephemeral: true,
  tts: false
}