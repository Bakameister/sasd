import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Medal from '../../../models/Medal.js';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export const data = new SlashCommandBuilder()
  .setName('modificarmedalla')
  .setDescription('Modifica una medalla existente')
  .addStringOption(option =>
    option.setName('nombre_actual')
      .setDescription('Nombre de la medalla a modificar')
      .setRequired(true)
      .setAutocomplete(true))
  .addStringOption(option =>
    option.setName('nuevo_nombre')
      .setDescription('Nuevo nombre de la medalla')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('nueva_descripcion')
      .setDescription('Nueva descripción de la medalla')
      .setRequired(false))
  .addAttachmentOption(option =>
    option.setName('nueva_imagen')
      .setDescription('Nueva imagen para la medalla')
      .setRequired(false));

export async function execute(interaction) {
  if (!interaction.member.permissions.has('ADMINISTRATOR')) {
    return interaction.reply({
      content: '❌ No tienes permisos para usar este comando.',
      ephemeral: true
    });
  }

  await interaction.deferReply();

  try {
    const currentName = interaction.options.getString('nombre_actual');
    const newName = interaction.options.getString('nuevo_nombre');
    const newDescription = interaction.options.getString('nueva_descripcion');
    const newImage = interaction.options.getAttachment('nueva_imagen');

    const medal = await Medal.findOne({ name: currentName });
    if (!medal) {
      const allMedals = await Medal.find({});
      const medalsEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🎖️ Medallas Disponibles')
        .setDescription(allMedals.map(m => `**ID:** ${m.medalId} - **Nombre:** ${m.name}`).join('\n'));

      return interaction.editReply({
        content: '❌ No se encontró la medalla especificada.',
        embeds: [medalsEmbed]
      });
    }

    if (newName) medal.name = newName;
    if (newDescription) medal.description = newDescription;

    if (newImage) {
      if (!newImage.contentType?.startsWith('image/')) {
        return interaction.editReply('❌ El archivo debe ser una imagen.');
      }

      const imagePath = path.join(process.cwd(), 'images', 'medallas', `${medal.medalId}.png`);
      
      const imageBuffer = await fetch(newImage.url).then(res => res.arrayBuffer());
      await sharp(Buffer.from(imageBuffer))
        .resize(128, 128)
        .png()
        .toFile(imagePath);

      medal.imageUrl = `file://${imagePath}`;
    }

    await medal.save();

    const logChannel = await interaction.guild.channels.fetch(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('🔄 Medalla Modificada')
        .setDescription(`Se ha modificado la medalla "${currentName}"`)
        .addFields(
          newName ? { name: 'Nuevo Nombre', value: newName } : null,
          newDescription ? { name: 'Nueva Descripción', value: newDescription } : null,
          newImage ? { name: 'Nueva Imagen', value: '✅' } : null
        )
        .setTimestamp();
      
      await logChannel.send({ embeds: [logEmbed] });
    }

    return interaction.editReply({
      content: `✅ Medalla "${currentName}" modificada exitosamente.`
    });
  } catch (error) {
    console.error('Error al modificar medalla:', error);
    return interaction.editReply({
      content: '❌ Hubo un error al modificar la medalla.'
    });
  }
}