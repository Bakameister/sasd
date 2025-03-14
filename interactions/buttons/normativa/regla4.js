import { EmbedBuilder } from 'discord.js';

export const customId = 'regla4';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#ff5555')
      .setTitle('📑 Regla 4: Zona de carga')
      .setDescription('Las zonas de carga son áreas seguras. Está prohibido realizar cualquier tipo de actividad hostil, robos o asesinatos en estas zonas.')
      .addFields(
        { name: 'Zonas protegidas', value: 'Incluyen muelles, almacenes designados y áreas específicamente marcadas como zonas de carga.' },
        { name: 'Excepciones', value: 'Situaciones de legítima defensa documentadas adecuadamente.' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla4:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}