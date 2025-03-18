import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Medal from '../../../models/Medal.js';
import UserMedal from '../../../models/UserMedal.js';

export const data = new SlashCommandBuilder()
  .setName('darmedalla')
  .setDescription('Otorga una medalla a un usuario')
  .addUserOption(option =>
    option.setName('usuario')
      .setDescription('Usuario que recibirá la medalla')
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
    // Mostrar lista de medallas disponibles
    const allMedals = await Medal.find({});
    const medalsEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🎖️ Lista de Medallas Disponibles')
      .setDescription(allMedals.map(m => `**ID:** ${m.medalId} - **Nombre:** ${m.name} - **Descripción:** ${m.description}`).join('\n'));

    const medal = await Medal.findOne({ name: medalName });
    if (!medal) {
      await interaction.reply({
        embeds: [medalsEmbed],
        content: '❌ No se encontró una medalla con ese nombre.',
        ephemeral: true
      });
      return;
    }

    const existingUserMedal = await UserMedal.findOne({
      userId: targetUser.id,
      medalId: medal.medalId
    });

    if (existingUserMedal) {
      return interaction.reply({
        embeds: [medalsEmbed],
        content: `❌ ${targetUser.username} ya tiene esta medalla.`,
        ephemeral: true
      });
    }

    const userMedal = new UserMedal({
      userId: targetUser.id,
      medalId: medal.medalId
    });

    await userMedal.save();

    // Enviar log al canal de registros
    const logChannel = await interaction.guild.channels.fetch(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🎖️ Medalla Otorgada')
        .setDescription(`Se ha otorgado la medalla "${medal.name}" a ${targetUser.tag}`)
        .setTimestamp();
      
      await logChannel.send({ embeds: [logEmbed] });
    }

    return interaction.reply({
      embeds: [medalsEmbed],
      content: `✅ Se ha otorgado la medalla "${medalName}" a ${targetUser.username}`,
      ephemeral: false
    });
  } catch (error) {
    console.error('Error al dar medalla:', error);
    return interaction.reply({
      content: '❌ Hubo un error al otorgar la medalla.',
      ephemeral: true
    });
  }
}