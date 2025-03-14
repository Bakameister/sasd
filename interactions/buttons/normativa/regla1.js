import { EmbedBuilder } from 'discord.js';

export const customId = 'regla1';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#ff5555')
      .setTitle('📑 Regla 1: Death Match')
      .setDescription('Está prohibido el Death Match (DM) en cualquier circunstancia. El DM se define como matar a otro jugador sin una razón de rol válida o sin interacción previa.')
      .addFields(
        { name: 'Consecuencias', value: 'Las infracciones pueden resultar en advertencias, suspensiones temporales o expulsión permanente del servidor, dependiendo de la gravedad y reincidencia.' },
        { name: 'Reporte', value: 'Si eres víctima de DM, reporta el incidente a través del sistema de tickets con pruebas (clips o capturas de pantalla).' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla1:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}