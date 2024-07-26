const fs = require('fs')
const logger = require('../utils/functions/tools/logging/logger')

module.exports = async function handleComponents(client) {
  const componentFolders = fs.readdirSync(`./src/components`)
  logger("Components", `Started loading components`)
  for (const folder of componentFolders) {
    const {
      buttons,
      selectMenus,
      modals
    } = client

    switch (folder) {
      case "buttons":
        for (const subfolder of fs.readdirSync(`./src/components/${folder}`)) {
          for (const file of fs.readdirSync(`./src/components/${folder}/${subfolder}`)) {
            const button = require(`../components/${folder}/${subfolder}/${file}`)
            buttons.set(button.name, button)
          }
        }
        break

      case "select menus":
        for (const subfolder of fs.readdirSync(`./src/components/${folder}`)) {
          for (const file of fs.readdirSync(`./src/components/${folder}/${subfolder}`)) {
            const selectMenu = require(`../components/${folder}/${subfolder}/${file}`)
            selectMenus.set(selectMenu.name, selectMenu)
          }
        }
        break

      case "modals":
        for (const subfolder of fs.readdirSync(`./src/components/${folder}`)) {
          for (const file of fs.readdirSync(`./src/components/${folder}/${subfolder}`)) {
            const modal = require(`../components/${folder}/${subfolder}/${file}`)
            modals.set(modal.name, modal)
          }
        }
        break

      default:
        break
    }
  }
  logger("Components", `Finished loading components`)
}