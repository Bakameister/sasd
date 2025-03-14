import { EmbedBuilder } from 'discord.js';

export const customId = 'regla8';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#5555ff')
      .setTitle('📑 Regla 8: Temas de conversación')
      .setDescription('Están prohibidos los temas de conversación sensibles como política divisiva, religión controversial o cualquier tema que pueda generar conflictos graves.')
      .addFields(
        { name: 'Objetivo', value: 'Mantener un ambiente agradable y evitar discusiones que no están relacionadas con el propósito del servidor.' },
        { name: 'Moderación', value: 'Los moderadores pueden intervenir y redirigir conversaciones que se desvíen hacia temas prohibidos.' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla8:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}