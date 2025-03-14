import { EmbedBuilder } from 'discord.js';

export const customId = 'exampleMenu';

export async function execute(interaction) {
  try {
    const selected = interaction.values[0];
    
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Opción seleccionada: ${selected}`)
      .setDescription('Has seleccionado una opción del menú desplegable.')
      .setTimestamp()
      .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del menú de selección:', error);
    await interaction.reply({ content: '❌ Hubo un error al procesar tu selección.', ephemeral: true });
  }
}