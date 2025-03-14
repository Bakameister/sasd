import { EmbedBuilder } from 'discord.js';

export const customId = 'reject_form';

export async function execute(interaction) {
  try {
    const userId = interaction.customId.split('_')[2];
    
    const embed = EmbedBuilder.from(interaction.message.embeds[0])
      .setColor('#ff0000')
      .setFooter({ text: 'Estado: Rechazado' });
    
    await interaction.message.edit({
      embeds: [embed],
      components: []
    });

    const user = await interaction.client.users.fetch(userId);
    if (user) {
      const rejectEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Solicitud Rechazada')
        .setDescription('Lo sentimos, tu solicitud ha sido rechazada.')
        .setTimestamp();

      await user.send({ embeds: [rejectEmbed] });
    }

    await interaction.reply({
      content: '✅ Solicitud rechazada correctamente.',
      ephemeral: true
    });
  } catch (error) {
    console.error('Error al rechazar la solicitud:', error);
    await interaction.reply({
      content: '❌ Hubo un error al procesar el rechazo.',
      ephemeral: true
    });
  }
}