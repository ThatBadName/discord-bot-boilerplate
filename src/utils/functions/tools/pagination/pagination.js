const {
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require("discord.js");
const genericErrorMessage = require('../../../messages/errors/genericError');
const interactionPaginiation = async (
  interaction,
  pages,
  timeout = 120000,
  remove = false,
  buttonList = [
    new ButtonBuilder()
      .setCustomId(`ignoreMe:1`)
      .setLabel(`<<`)
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId(`ignoreMe:2`)
      .setLabel(`<`)
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId(`ignoreMe:3`)
      .setLabel(`>`)
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId(`ignoreMe:4`)
      .setLabel(`>>`)
      .setStyle(ButtonStyle.Primary),
  ],
) => {
  if (!pages) throw new Error("Pages are not given.");
  if (!buttonList) throw new Error("Buttons are not given.");

  let page = 0;

  const row = new ActionRowBuilder().addComponents(buttonList);

  //has the interaction already been deferred? If not, defer the reply.
  if (interaction.deferred == false) {
    await interaction.deferReply().catch(() => { })
  }

  const curPage = await interaction.editReply({
    content: pages[page] + `\n\n*Page ${page + 1} / ${pages.length} | ${Math.round((page + 1) / (pages.length) * 100)}% through*`,
    components: [row],
    fetchReply: true,
    allowedMentions: []
  }).catch(() => {
    interaction.followUp(genericErrorMessage)
  })

  const filter = (i) =>
    i.customId === buttonList[0].data.custom_id ||
    i.customId === buttonList[1].data.custom_id ||
    i.customId === buttonList[2].data.custom_id ||
    i.customId === buttonList[3].data.custom_id;

  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    switch (i.customId) {
      case buttonList[0].data.custom_id:
        page = 0;
        break
      case buttonList[1].data.custom_id:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case buttonList[2].data.custom_id:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      case buttonList[3].data.custom_id:
        page = pages.length - 1;
        break
      default:
        break;
    }
    await i.deferUpdate();
    await i.editReply({
      content: pages[page] + `\n\n*Page ${page + 1} / ${pages.length} | ${Math.round((page + 1) / (pages.length) * 100)}% through*`,
      components: [row],
      allowedMentions: []
    }).catch(() => {
      interaction.followUp(genericErrorMessage)
    })
    collector.resetTimer();
  });

  collector.on("end", (_, reason) => {
    if (reason !== "messageDelete") {
      if (remove) curPage.delete()
      else interaction.editReply({
        content: pages[page] + `\n\n*Page ${page + 1} / ${pages.length} | ${Math.round((page + 1) / (pages.length) * 100)}% through*`,
        components: [],
        allowedMentions: []
      }).catch(() => {
        interaction.followUp(genericErrorMessage)
      })
    }
  });

  return curPage;
};
module.exports = interactionPaginiation;