import { EmbedBuilder } from 'discord.js';

export const customId = 'regla5';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#ff5555')
      .setTitle('📑 Regla 5: Plantaciones')
      .setDescription('Las plantaciones y laboratorios son propiedad de la organización. Su uso no autorizado está prohibido y será sancionado.')
      .addFields(
        { name: 'Acceso', value: 'Solo miembros autorizados pueden acceder y operar en estas instalaciones.' },
        { name: 'Sanciones', value: 'El uso no autorizado puede resultar en expulsión de la organización y posibles acciones IC adicionales.' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla5:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}