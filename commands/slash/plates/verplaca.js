import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'path';
import { fileURLToPath } from 'url';
import Empleado from '../../../models/Empleado.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const data = new SlashCommandBuilder()
  .setName('verplaca')
  .setDescription('Muestra la placa de sheriff de un usuario')
  .addUserOption(option =>
    option.setName('usuario').setDescription('Usuario a ver la placa').setRequired(true)
  );

export async function execute(interaction) {
  await interaction.deferReply();

  try {
    const usuario = interaction.options.getMember('usuario');
    const empleado = await Empleado.findOne({ apellido: usuario.user.discriminator });

    if (!empleado) {
      return interaction.editReply('Este usuario no tiene una placa registrada.');
    }

    const fondoPath = path.resolve('images', 'placas', 'fondo_sasd.png');
    const sheriffCanvas = createCanvas(1000, 500);
    const ctx = sheriffCanvas.getContext('2d');

    try {
      const fondo = await loadImage(fondoPath);
      ctx.drawImage(fondo, 0, 0, sheriffCanvas.width, sheriffCanvas.height);
    } catch (error) {
      console.error(`No se encontró la imagen para el empleado ${empleado.empleadoId}:`, error);
      return interaction.editReply(`No se encontró imagen para el empleado ${empleado.empleadoId}`);
    }

    // Configurar el estilo del texto
    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    // Dibujar el nombre del usuario
    ctx.fillText(usuario.displayName, sheriffCanvas.width / 2, 200);

    // Dibujar el ID del empleado
    const empleadoId = empleado.empleadoId?.toString() || '';
    if (empleadoId) {
      ctx.fillText(`N° ${empleadoId}`, sheriffCanvas.width / 2, 400);
    } else {
      console.error('empleadoId is undefined or empty');
      return interaction.editReply('Error: ID de empleado no válido.');
    }

    // Convertir el canvas a un buffer y enviarlo
    const buffer = await sheriffCanvas.encode('png');
    const attachment = new AttachmentBuilder(buffer, { name: 'placa_sheriff.png' });
    
    await interaction.editReply({ files: [attachment] });
  } catch (error) {
    console.error('Error al generar la placa:', error);
    await interaction.editReply('Hubo un error al generar la placa.');
  }
}