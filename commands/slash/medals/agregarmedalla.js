import { SlashCommandBuilder } from 'discord.js';
import Medal from '../../../models/Medal.js';
import path from 'path';
import sharp from 'sharp';

export const data = new SlashCommandBuilder()
    .setName('agregarmedalla')
    .setDescription('Agrega una nueva medalla al sistema')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('ID único de la medalla')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('nombre')
            .setDescription('Nombre de la medalla')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('descripcion')
            .setDescription('Descripción de la medalla')
            .setRequired(true))
    .addAttachmentOption(option =>
        option.setName('imagen')
            .setDescription('Imagen de la medalla')
            .setRequired(true));

export async function execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return interaction.reply({
            content: '❌ No tienes permisos para usar este comando.',
            ephemeral: true
        });
    }

    await interaction.deferReply();

    const medalId = interaction.options.getString('id');
    const name = interaction.options.getString('nombre');
    const description = interaction.options.getString('descripcion');
    const image = interaction.options.getAttachment('imagen');

    try {
        if (!image.contentType?.startsWith('image/')) {
            return interaction.editReply('❌ El archivo debe ser una imagen.');
        }

        const existingMedal = await Medal.findOne({ medalId });
        if (existingMedal) {
            return interaction.editReply({
                content: '❌ Ya existe una medalla con ese ID.',
                ephemeral: true
            });
        }

        const imagePath = path.join(process.cwd(), 'images', 'medallas', `${medalId}.png`);

        const imageBuffer = await fetch(image.url).then(res => res.arrayBuffer());
        await sharp(Buffer.from(imageBuffer))
            .resize(128, 128)
            .png()
            .toFile(imagePath);

        // Corregir la construcción de imageUrl para usar la ruta relativa
        const relativeImagePath = path.join('medallas', `${medalId}.png`);

        const medal = new Medal({
            medalId,
            name,
            description,
            imageUrl: relativeImagePath // Usar la ruta relativa
        });

        await medal.save();

        return interaction.editReply({
            content: `✅ Medalla "${name}" agregada exitosamente con ID: ${medalId}`,
            ephemeral: true
        });
    } catch (error) {
        console.error('Error al agregar medalla:', error);
        return interaction.editReply({
            content: '❌ Hubo un error al agregar la medalla.',
            ephemeral: true
        });
    }
}