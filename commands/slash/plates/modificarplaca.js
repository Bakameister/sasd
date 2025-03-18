import {
    SlashCommandBuilder,
    EmbedBuilder,
    AutocompleteInteraction,
  } from 'discord.js';
  import Plate from '../../../models/Plate.js';
  import fs from 'fs/promises';
  import path from 'path';
  import sharp from 'sharp';
  
  export const data = new SlashCommandBuilder()
    .setName('modificarplaca')
    .setDescription('Modifica una placa existente')
    .addStringOption((option) =>
      option
        .setName('nombre_actual')
        .setDescription('Nombre de la placa a modificar')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option.setName('nuevo_nombre').setDescription('Nuevo nombre de la placa').setRequired(false)
    )
    .addRoleOption((option) =>
      option.setName('nuevo_rol').setDescription('Nuevo rol para la placa').setRequired(false)
    )
    .addAttachmentOption((option) =>
      option.setName('nueva_imagen').setDescription('Nueva imagen para la placa').setRequired(false)
    );
  
  export async function execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({
        content: '❌ No tienes permisos para usar este comando.',
        ephemeral: true,
      });
    }
  
    await interaction.deferReply();
  
    try {
      const currentName = interaction.options.getString('nombre_actual');
      const newName = interaction.options.getString('nuevo_nombre');
      const newRole = interaction.options.getRole('nuevo_rol');
      const newImage = interaction.options.getAttachment('nueva_imagen');
  
      const plate = await Plate.findOne({ name: currentName });
      if (!plate) {
        const allPlates = await Plate.find({});
        const platesEmbed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('📋 Placas Disponibles')
          .setDescription(allPlates.map((p) => `**ID:** ${p.plateId} - **Nombre:** ${p.name}`).join('\n'));
  
        return interaction.editReply({
          content: '❌ No se encontró la placa especificada.',
          embeds: [platesEmbed],
        });
      }
  
      if (newName) plate.name = newName;
      if (newRole) plate.roleId = newRole.id;
  
      if (newImage) {
        if (!newImage.contentType?.startsWith('image/')) {
          return interaction.editReply('❌ El archivo debe ser una imagen.');
        }
  
        const imagePath = path.join(process.cwd(), 'images', 'placas', `${plate.plateId}.png`);
  
        const imageBuffer = await fetch(newImage.url).then((res) => res.arrayBuffer());
        await sharp(Buffer.from(imageBuffer)).resize(128, 128).png().toFile(imagePath);
  
        plate.imageUrl = `file://${imagePath}`;
      }
  
      await plate.save();
  
      const logChannel = await interaction.guild.channels.fetch(process.env.LOG_CHANNEL_ID);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('🔄 Placa Modificada')
          .setDescription(`Se ha modificado la placa "${currentName}"`)
          .addFields(
            newName ? { name: 'Nuevo Nombre', value: newName } : null,
            newRole ? { name: 'Nuevo Rol', value: newRole.name } : null,
            newImage ? { name: 'Nueva Imagen', value: '✅' } : null
          )
          .setTimestamp();
  
        await logChannel.send({ embeds: [logEmbed] });
      }
  
      return interaction.editReply({
        content: `✅ Placa "${currentName}" modificada exitosamente.`,
      });
    } catch (error) {
      console.error('Error al modificar placa:', error);
      return interaction.editReply({
        content: '❌ Hubo un error al modificar la placa.',
      });
    }
  }
  
  // Manejador de autocompletado
  export async function autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = await Plate.find({
      name: { $regex: focusedValue, $options: 'i' },
    }).limit(25); // Limitar las opciones para no saturar Discord
  
    await interaction.respond(
      choices.map((choice) => ({ name: choice.name, value: choice.name }))
    );
  }