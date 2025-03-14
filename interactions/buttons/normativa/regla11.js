import { EmbedBuilder } from 'discord.js';

export const customId = 'regla11';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#5555ff')
      .setTitle('📑 Regla 11: Tickets de soporte')
      .setDescription('Los tickets de soporte deben utilizarse únicamente para su propósito designado. El abuso del sistema de tickets está prohibido.')
      .addFields(
        { name: 'Uso correcto', value: 'Utiliza los tickets para reportar problemas, hacer consultas importantes o solicitar asistencia de los administradores.' },
        { name: 'Abuso', value: 'Crear tickets sin motivo válido, para bromas o de forma excesiva puede resultar en restricción del acceso al sistema de tickets.' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla11:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}