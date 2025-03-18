import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import mongoose from 'mongoose';
import Empleado from '../../../models/Empleado.js';
import Plate from '../../../models/Plate.js';
import UserPlate from '../../../models/UserPlate.js';

export const data = new SlashCommandBuilder()
  .setName('registrarempleado')
  .setDescription('Registra un nuevo empleado')
  .addUserOption(option =>
    option.setName('usuario').setDescription('Usuario a registrar').setRequired(true)
  )
  .addRoleOption(option =>
    option.setName('rango').setDescription('Rol del empleado').setRequired(true)
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
    const usuario = interaction.options.getMember('usuario');
    const rango = interaction.options.getRole('rango');
    const empleadoId = await getNextEmpleadoId();

    const empleadoExistente = await Empleado.findOne({ apellido: usuario.user.discriminator });
    if (empleadoExistente) {
      return interaction.editReply('❌ Este usuario ya ha sido registrado como empleado.');
    }

    if (empleadoId > 400) {
      return interaction.editReply('❌ Se ha alcanzado el límite máximo de empleados (400).');
    }

    const placa = await Plate.findOne({ name: 'Identificación' });
    if (!placa) {
      return interaction.editReply('❌ No se encontró la placa predefinida.');
    }

    const nuevoEmpleado = new Empleado({
      empleadoId: empleadoId,
      nombre: usuario.displayName,
      apellido: usuario.user.discriminator,
      nickname: usuario.displayName,
      rolId: rango.id,
      placaId: placa.plateId,
    });
    await nuevoEmpleado.save();

    try {
      await usuario.roles.add(rango);
    } catch (error) {
      console.error('Error al asignar el rol:', error);
      await interaction.editReply('❌ Se registró el empleado, pero hubo un error al asignar el rol.');
      return;
    }

    const nuevaUserPlaca = new UserPlate({
      userId: usuario.id,
      plateId: placa.plateId,
      nickname: usuario.displayName,
      assignedBy: 'registrarempleado',
      order: 0,
    });
    await nuevaUserPlaca.save();

    await interaction.editReply(
      `✅ Empleado ${usuario.displayName} registrado con ID **${empleadoId}** y rango **${rango.name}**.`
    );
  } catch (error) {
    console.error('Error al registrar empleado:', error);
    await interaction.editReply('❌ Hubo un error al registrar el empleado.');
  }
}

async function getNextEmpleadoId() {
  const lastEmpleado = await Empleado.findOne().sort({ empleadoId: -1 });
  return lastEmpleado ? lastEmpleado.empleadoId + 1 : 1;
}