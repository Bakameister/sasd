import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('normativa')
  .setDescription('Crea mensaje en el canal de normativas IC/OCC');

export async function execute(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });
    
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
    const reglasImage = new AttachmentBuilder('https://i.ibb.co/0yWVCBs/reglasic-img.png', { name: 'reglasic.png' });
    const reglasImage2 = new AttachmentBuilder('https://i.ibb.co/h1B5X8p/reglasooc-img.png', { name: 'reglasooc.png' });
    const footerImage = new AttachmentBuilder('https://i.ibb.co/W4tRbN4/footer-reglas.png', { name: 'footer.png' });

    await interaction.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await interaction.channel.send({ files: [reglasImage] });
    await interaction.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await interaction.channel.send({ components: [row] });
    await interaction.channel.send({ components: [row1] });
    await interaction.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await interaction.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await interaction.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await interaction.channel.send({ files: [reglasImage2] });
    await interaction.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await interaction.channel.send({ components: [row3] });
    await interaction.channel.send({ components: [row4] });
    await interaction.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await interaction.channel.send({ files: [footerImage] });

    await interaction.editReply('✅ Normativa enviada correctamente.');
  } catch (error) {
    console.error('Error al ejecutar el comando slash normativa:', error);
    await interaction.editReply('❌ Hubo un error al enviar las reglas.');
  }
}