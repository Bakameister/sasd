import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Medal from '../../../models/Medal.js';
import UserMedal from '../../../models/UserMedal.js';

export const data = new SlashCommandBuilder()
  .setName('removermedalla')
  .setDescription('Remueve una medalla de un usuario')
  .addUserOption(option =>
    option.setName('usuario')
      .setDescription('Usuario al que se le removerá la medalla')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('medalla')
      .setDescription('Nombre de la medalla')
      .setRequired(true));

export async function execute(interaction) {
  if (!interaction.member.permissions.has('ADMINISTRATOR')) {
    return interaction.reply({
      content: '❌ No tienes permisos para usar este comando.',
      ephemeral: true
    });
  }

  const targetUser = interaction.options.getUser('usuario');
  const medalName = interaction.options.getString('medalla');

  try {
    const medal = await Medal.findOne({ name: medalName });
    if (!medal) {
      return interaction.reply({
        content: '❌ No se encontró una medalla con ese nombre.',
        ephemeral: true
      });
    }

    const result = await UserMedal.findOneAndDelete({
      userId: targetUser.id,
      medalId: medal.medalId
    });

    if (!result) {
      return interaction.reply({
        content: `❌ ${targetUser.username} no tiene esta medalla.`,
        ephemeral: true
      });
    }

    // Enviar log al canal de registros
    const logChannel = await interaction.guild.channels.fetch(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🎖️ Medalla Removida')
        .setDescription(`Se ha removido la medalla "${medal.name}" de ${targetUser.tag}`)
        .setTimestamp();
      
      await logChannel.send({ embeds: [logEmbed] });
    }

    return interaction.reply({
      content: `✅ Se ha removido la medalla "${medalName}" de ${targetUser.username}`,
      ephemeral: false
    });
  } catch (error) {
    console.error('Error al remover medalla:', error);
    return interaction.reply({
      content: '❌ Hubo un error al remover la medalla.',
      ephemeral: true
    });
  }
}