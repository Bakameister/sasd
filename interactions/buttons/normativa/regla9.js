import { EmbedBuilder } from 'discord.js';

export const customId = 'regla9';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#5555ff')
      .setTitle('📑 Regla 9: Spam')
      .setDescription('Está prohibido el spam en cualquier canal. Esto incluye mensajes repetitivos, publicidad no autorizada, y uso excesivo de emojis o mayúsculas.')
      .addFields(
        { name: 'Definición', value: 'Se considera spam cualquier mensaje que no aporte valor y que se envíe con alta frecuencia o en gran cantidad.' },
        { name: 'Sanciones', value: 'Las infracciones pueden resultar en silenciamiento temporal o permanente en los canales afectados.' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla9:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}