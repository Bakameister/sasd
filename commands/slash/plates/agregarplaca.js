import { SlashCommandBuilder } from 'discord.js';
import Plate from '../../../models/Plate.js';
import path from 'path';
import sharp from 'sharp';

export const data = new SlashCommandBuilder()
    .setName('agregarplaca')
    .setDescription('Agrega una nueva placa al sistema')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('ID único de la placa')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('nombre')
            .setDescription('Nombre de la placa')
            .setRequired(true))
    .addRoleOption(option =>
        option.setName('rol')
            .setDescription('Rol que se asignará con esta placa')
            .setRequired(true))
    .addAttachmentOption(option =>
        option.setName('imagen')
            .setDescription('Imagen de la placa')
            .setRequired(true));

export async function execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return interaction.reply({
            content: '❌ No tienes permisos para usar este comando.',
            ephemeral: true
        });
    }

    await interaction.deferReply();

    const plateId = interaction.options.getString('id');
    const name = interaction.options.getString('nombre');
    const role = interaction.options.getRole('rol');
    const image = interaction.options.getAttachment('imagen');

    try {
        if (!image.contentType?.startsWith('image/')) {
            return interaction.editReply('❌ El archivo debe ser una imagen.');
        }

        const existingPlate = await Plate.findOne({ plateId });
        if (existingPlate) {
            return interaction.editReply({
                content: '❌ Ya existe una placa con ese ID.',
                ephemeral: true
            });
        }

        const imagePath = path.join(process.cwd(), 'images', 'placas', `${plateId}.png`);

        const imageBuffer = await fetch(image.url).then(res => res.arrayBuffer());
        await sharp(Buffer.from(imageBuffer))
            .resize(128, 128)
            .png()
            .toFile(imagePath);

        // Corregir la construcción de imageUrl para usar la ruta relativa
        const relativeImagePath = path.join('placas', `${plateId}.png`);

        const plate = new Plate({
            plateId,
            name,
            roleId: role.id,
            imageUrl: relativeImagePath // Usar la ruta relativa
        });

        await plate.save();

        return interaction.editReply({
            content: `✅ Placa "${name}" agregada exitosamente con ID: ${plateId} y rol: ${role.name}`,
            ephemeral: true
        });
    } catch (error) {
        console.error('Error al agregar placa:', error);
        return interaction.editReply({
            content: '❌ Hubo un error al agregar la placa.',
            ephemeral: true
        });
    }
}