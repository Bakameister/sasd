import { EmbedBuilder } from 'discord.js';

export const customId = 'regla2';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#ff5555')
      .setTitle('📑 Regla 2: Insultos entre empleados')
      .setDescription('Los insultos graves entre empleados están prohibidos. Las discusiones deben mantenerse dentro de un marco de respeto mutuo, incluso en situaciones de conflicto IC.')
      .addFields(
        { name: 'Excepciones', value: 'Se permiten insultos leves como parte del rol siempre que no escalen a faltas de respeto personales.' },
        { name: 'Consecuencias', value: 'Las infracciones pueden resultar en sanciones internas, suspensiones temporales o expulsión de la organización.' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla2:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}