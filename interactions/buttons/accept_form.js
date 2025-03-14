import { EmbedBuilder } from 'discord.js';

export const customId = 'accept_form';

export async function execute(interaction) {
  try {
    const userId = interaction.customId.split('_')[2];
    
    const embed = EmbedBuilder.from(interaction.message.embeds[0])
      .setColor('#00ff00')
      .setFooter({ text: 'Estado: Aceptado' });
    
    await interaction.message.edit({
      embeds: [embed],
      components: []
    });

    const user = await interaction.client.users.fetch(userId);
    if (user) {
      const acceptEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Solicitud Aceptada')
        .setDescription('¡Felicidades! Tu solicitud ha sido aceptada.\nBienvenido a la academia SASD.')
        .setTimestamp();

      await user.send({ embeds: [acceptEmbed] });
    }

    await interaction.reply({
      content: '✅ Solicitud aceptada correctamente.',
      ephemeral: true
    });
  } catch (error) {
    console.error('Error al aceptar la solicitud:', error);
    await interaction.reply({
      content: '❌ Hubo un error al procesar la aceptación.',
      ephemeral: true
    });
  }
}