import { ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';

export const data = {
  name: 'preuba22',
  description: 'Crea mensaje en el canal del decálogo Denver Family',
};

export async function execute(message) {
  try {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('deca1')
        .setLabel('📖 Deber de respeto')
        .setStyle(ButtonStyle.Secondary)
    );

    // Cargar imágenes como attachments
   const reglasImage = new AttachmentBuilder('./images/decálogo_img.png', { name: 'decálogo_img.png' });
   const footerImage = new AttachmentBuilder('./images/footer_decálogo.png', { name: 'footer_decálogo.png' });

    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ files: [reglasImage] });
    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ components: [row] });
    await message.channel.send({ components: [row1] });
    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ files: [footerImage] });

    await message.delete();
  } catch (error) {
    console.error('Error al ejecutar el comando:', error);
    await message.reply('❌ Hubo un error al enviar las reglas.');
  }
}