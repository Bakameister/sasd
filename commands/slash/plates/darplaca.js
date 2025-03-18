import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Plate from '../../../models/Plate.js';
import UserPlate from '../../../models/UserPlate.js';

export const data = new SlashCommandBuilder()
  .setName('darplaca')
  .setDescription('Otorga una placa a un usuario')
  .addUserOption(option =>
    option.setName('usuario').setDescription('Usuario que recibirá la placa').setRequired(true)
  )
  .addStringOption(option =>
    option.setName('placa').setDescription('Nombre de la placa').setRequired(true)
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
    const nombrePlaca = interaction.options.getString('placa');

    const allPlates = await Plate.find({});
    const platesEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📋 Lista de Placas Disponibles')
      .setDescription(allPlates.map(p => `**ID:** ${p.plateId} - **Nombre:** ${p.name}`).join('\n'));

    const plate = await Plate.findOne({ name: nombrePlaca });
    if (!plate) {
      return interaction.editReply({
        embeds: [platesEmbed],
        content: `❌ No se encontró una placa con el nombre "${nombrePlaca}".`,
        ephemeral: true,
      });
    }

    const member = await interaction.guild.members.fetch(usuario.id);

    if (plate.roleId) {
      try {
        await member.roles.add(plate.roleId);
      } catch (error) {
        console.error('Error al asignar el rol:', error);
        return interaction.editReply('❌ Se asignó la placa, pero hubo un error al asignar el rol.');
      }
    } else {
      console.error('El roleId de la placa no está definido');
    }

    // Obtener el máximo valor de order para el usuario
    const maxOrder = await UserPlate.findOne({ userId: usuario.id }).sort({ order: -1 });
    const order = maxOrder ? maxOrder.order + 1 : 1;

    const userPlate = new UserPlate({
      userId: usuario.id,
      plateId: plate.plateId,
      nickname: member.displayName,
      assignedBy: 'darplaca',
      order: order, // Establecer el orden correcto
    });
    await userPlate.save();

    const logChannel = await interaction.guild.channels.fetch(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🏆 Placa Otorgada')
        .setDescription(`Se ha otorgado la placa "${plate.name}" a ${usuario.user.tag}`)
        .setTimestamp();

      await logChannel.send({ embeds: [logEmbed] });
    }

    await interaction.editReply({
      embeds: [platesEmbed],
      content: `✅ Se ha otorgado la placa "${plate.name}" a ${usuario.user.username}`,
      ephemeral: false,
    });
  } catch (error) {
    console.error('Error al dar placa:', error);
    return interaction.editReply({
      content: '❌ Hubo un error al otorgar la placa.',
      ephemeral: true,
    });
  }
}