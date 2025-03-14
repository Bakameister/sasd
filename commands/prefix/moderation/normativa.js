import { ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';

export const data = {
  name: 'normativa',
  description: 'Crea mensaje en el canal de normativas IC/OCC',
};

export async function execute(message) {
  try {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('regla1')
        .setLabel('📑 Death Match')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('regla2')
        .setLabel('📑 Insultos entre empleados')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('regla3')
        .setLabel('📑 Comportamientos tóxicos')
        .setStyle(ButtonStyle.Secondary)
    );

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('regla4')
        .setLabel('📑 Zona de carga')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('regla5')
        .setLabel('📑 Plantaciones')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('regla6')
        .setLabel('📑 Respeto a la jerarquía')
        .setStyle(ButtonStyle.Secondary)
    );

    const row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('regla7')
        .setLabel('📑 Comportamiento hacia otros usuarios')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('regla8')
        .setLabel('📑 Temas de conversación')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('regla9')
        .setLabel('📑 Spam')
        .setStyle(ButtonStyle.Secondary)
    );
  
    const row4 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('regla10')
        .setLabel('📑 Menciones y flood')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('regla11')
        .setLabel('📑 Tickets de soporte')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('regla12')
        .setLabel('📑 Uso adecuado de canales')
        .setStyle(ButtonStyle.Secondary)
    );

    // Cargar imágenes como attachments
    const reglasImage = new AttachmentBuilder('./images/reglasic_img.png', { name: 'reglasic_img.png' });
    const reglasImage2 = new AttachmentBuilder('./images/reglasooc_img.png', { name: 'reglasooc_img.png' });
    const footerImage = new AttachmentBuilder('./images/footer_reglas.png', { name: 'footer_reglas.png' });

    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ files: [reglasImage] });
    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ components: [row] });
    await message.channel.send({ components: [row1] });
    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ files: [reglasImage2] });
    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ components: [row3] });
    await message.channel.send({ components: [row4] });
    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ files: [footerImage] });

    await message.delete();
  } catch (error) {
    console.error('Error al ejecutar el comando:', error);
    await message.reply('❌ Hubo un error al enviar las reglas.');
  }
}