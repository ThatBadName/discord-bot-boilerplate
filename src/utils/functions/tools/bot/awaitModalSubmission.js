const { Interaction, Modal, ModalSubmitInteraction, InteractionCollector } = require('discord.js');

/**
 * Function to await modal submission
 * @param {Interaction} interaction - The interaction object from Discord.js
 * @param {Modal} modal - The modal object to be shown
 * @param {number} time - Timeout period to wait for the modal submission (in milliseconds)
 */
async function modalSubmission(interaction, modal, time, returnAsValueObject = true) {
  return new Promise((resolve, reject) => {
    const filter = (i) => {
      return i.customId === modal.data.custom_id && i.user.id === interaction.user.id
    };

    const collector = new InteractionCollector(interaction.client, { filter, time });

    collector.on('collect', (i) => {
      if (i instanceof ModalSubmitInteraction) {
        resolve({ modal: returnAsValueObject ? i.fields.fields.map(f => ({ id: f.customId, value: f.value })) : i, interaction: i });
        collector.stop();
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        reject(new Error('Modal submission timed out'));
      }
    });

    interaction.showModal(modal).catch(reject);
  });
}

module.exports = modalSubmission;