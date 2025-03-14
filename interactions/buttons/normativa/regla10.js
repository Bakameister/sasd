import { EmbedBuilder } from 'discord.js';

export const customId = 'regla10';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#5555ff')
      .setTitle('📑 Regla 10: Menciones y flood')
      .setDescription('Evita mencionar roles o usuarios innecesariamente. Las menciones masivas (@everyone, @here) están reservadas para anuncios oficiales.')
      .addFields(
        { name: 'Flood', value: 'Enviar múltiples mensajes cortos en lugar de uno más completo está prohibido.' },
        { name: 'Excepciones', value: 'Situaciones de emergencia que requieran atención inmediata de la administración.' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla10:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}