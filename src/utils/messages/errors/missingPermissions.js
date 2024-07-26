const config = require('../../../../config.json')

module.exports = {
  embeds: [
    {
      color: parseInt(config.assets.colours.primary, 16),
      description: `### ${config.assets.emojis.warn} You can't use this`
    }
  ],
  ephemeral: true,
  tts: false
}