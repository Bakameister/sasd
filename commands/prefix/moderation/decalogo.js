import { ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';

export const data = {
  name: 'decalogo',
  description: 'Crea mensaje en el canal del decálogo Denver Family',
};

export async function execute(message) {
  try {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('deca1')
        .setLabel('📖 Honor y disciplina')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('deca2')
        .setLabel('📖 Rol de calidad')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('deca3')
        .setLabel('📖 Jerarquía y orden')
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId('deca4')
        .setLabel('📖 Código de procedimientos')
        .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
        .setCustomId('deca5')
        .setLabel('📖 Radio y comunicación')
        .setStyle(ButtonStyle.Secondary)
    );

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('deca6')
        .setLabel('📖 Presencia y profesionalismo')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('deca7')
        .setLabel('📖 Lealtad al equipo')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('deca8')
        .setLabel('📖 Interacción con la ciudadanía')
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId('deca9')
        .setLabel('📖 Documentación y reportes')
        .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
        .setCustomId('deca10')
        .setLabel('📖 Mejora continua')
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
     
