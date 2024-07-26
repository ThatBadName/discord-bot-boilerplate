const config = require('../../../../config.json')

module.exports = {
  embeds: [
    {
      color: parseInt(config.assets.colours.primary, 16),
      description: `### ${config.assets.emojis.warn} This button doesn't have any code`
    }
  ],
  ephemeral: true,
  tts: false
}