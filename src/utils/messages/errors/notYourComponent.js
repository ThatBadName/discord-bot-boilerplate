const config = require('../../../../config.json')

module.exports = {
  embeds: [
    {
      color: parseInt(config.assets.colours.primary, 16),
      description: `### ${config.assets.emojis.warn} This is not for you`
    }
  ],
  ephemeral: true,
  tts: false
}