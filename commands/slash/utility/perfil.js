import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import mongoose from 'mongoose';

export const data = new SlashCommandBuilder()
  .setName('perfil')
  .setDescription('Muestra tu perfil de usuario');

export async function execute(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });

    // Verificar si hay conexión a MongoDB
    if (mongoose.connection.readyState !== 1) {
      return await interaction.editReply({
        content: '❌ No hay conexión a la base de datos. Este comando no está disponible.',
        ephemeral: true
      });
    }

    const { user } = interaction;

    // Importar el modelo User
    const User = mongoose.models.User;

    // Buscar el usuario en la base de datos
    const userProfile = await User.findOne({ discordId: user.id });

    if (!userProfile) {
      return await interaction.editReply({
        content: '❌ No estás registrado en el sistema. Usa /verificar para registrarte.',
        ephemeral: true
      });
    }

    // Crear embed con la información del perfil
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Perfil de ${userProfile.nickname}`)
      .setDescription(`Información de tu cuenta`)
      .addFields(
        { name: 'ID de Usuario', value: `${userProfile.userId}`, inline: true },
        { name: 'Nombre', value: `${userProfile.firstName}`, inline: true },
        { name: 'Apellido', value: `${userProfile.lastName}`, inline: true },
        { name: 'Nivel', value: `${userProfile.level}`, inline: true },
        { name: 'Fecha de Registro', value: userProfile.registrationDate.toLocaleDateString(), inline: true }
      )
      .setFooter({ text: `ID de Discord: ${user.id}`, iconURL: user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed], ephemeral: true });

  } catch (error) {
    console.error('Error al ejecutar el comando perfil:', error);
    await interaction.editReply({
      content: '❌ Hubo un error al procesar tu perfil. Por favor, inténtalo de nuevo más tarde.',
      ephemeral: true
    });
  }
}