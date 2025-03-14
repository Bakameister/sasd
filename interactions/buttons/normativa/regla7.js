import { EmbedBuilder } from 'discord.js';

export const customId = 'regla7';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#5555ff')
      .setTitle('📑 Regla 7: Comportamiento hacia otros usuarios')
      .setDescription('Todos los usuarios deben tratarse con respeto. No se tolerará el acoso, discriminación, insultos personales o comportamiento tóxico.')
      .addFields(
        { name: 'Aplicación', value: 'Esta regla aplica tanto en canales de texto como de voz, así como en mensajes privados relacionados con el servidor.' },
        { name: 'Reporte', value: 'Cualquier comportamiento inapropiado debe ser reportado a los moderadores con pruebas.' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla7:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}