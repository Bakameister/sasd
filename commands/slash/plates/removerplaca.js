import { SlashCommandBuilder } from 'discord.js';
import Plate from '../../../models/Plate.js';
import UserPlate from '../../../models/UserPlate.js';

export const data = new SlashCommandBuilder()
  .setName('removerplaca')
  .setDescription('Remueve una placa de un usuario')
  .addUserOption(option =>
    option.setName('usuario')
      .setDescription('Usuario al que se le removerá la placa')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('placa')
      .setDescription('Nombre de la placa')
      .setRequired(true));

export async function execute(interaction) {
  if (!interaction.member.permissions.has('ADMINISTRATOR')) {
    return interaction.reply({
      content: '❌ No tienes permisos para usar este comando.',
      ephemeral: true
    });
  }

  const targetUser = interaction.options.getUser('usuario');
  const plateName = interaction.options.getString('placa');

  try {
    const plate = await Plate.findOne({ name: plateName });
    if (!plate) {
      return interaction.reply({
        content: '❌ No se encontró una placa con ese nombre.',
        ephemeral: true
      });
    }

    const result = await UserPlate.findOneAndDelete({
      userId: targetUser.id,
      plateId: plate.plateId
    });

    if (!result) {
      return interaction.reply({
        content: `❌ ${targetUser.username} no tiene esta placa.`,
        ephemeral: true
      });
    }

    return interaction.reply({
      content: `✅ Se ha removido la placa "${plateName}" de ${targetUser.username}`,
      ephemeral: false
    });
  } catch (error) {
    console.error('Error al remover placa:', error);
    return interaction.reply({
      content: '❌ Hubo un error al remover la placa.',
      ephemeral: true
    });
  }
}