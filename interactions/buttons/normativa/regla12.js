import { EmbedBuilder } from 'discord.js';

export const customId = 'regla12';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#5555ff')
      .setTitle('📑 Regla 12: Uso adecuado de canales')
      .setDescription('Utiliza cada canal para su propósito específico. Los mensajes fuera de tema serán eliminados y pueden resultar en advertencias.')
      .addFields(
        { name: 'Canales temáticos', value: 'Respeta la temática de cada canal y evita conversaciones cruzadas entre canales.' },
        { name: 'Canales de comandos', value: 'Los canales destinados a comandos de bot deben utilizarse exclusivamente para ese fin.' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla12:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}