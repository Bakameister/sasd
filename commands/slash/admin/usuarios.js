import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, AttachmentBuilder } from 'discord.js';
import mongoose from 'mongoose';
import User from '../../../models/User.js';

export const data = new SlashCommandBuilder()
  .setName('usuarios')
  .setDescription('Gestiona los usuarios registrados')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand(subcommand =>
    subcommand
      .setName('listar')
      .setDescription('Muestra una lista de usuarios registrados')
      .addIntegerOption(option =>
        option.setName('página')
          .setDescription('Número de página')
          .setRequired(false)))
  .addSubcommand(subcommand =>
    subcommand
      .setName('info')
      .setDescription('Muestra información detallada de un usuario')
      .addUserOption(option =>
        option.setName('usuario')
          .setDescription('Usuario de Discord')
          .setRequired(true)))
  .addSubcommand(subcommand =>
    subcommand
      .setName('nivel')
      .setDescription('Cambia el nivel de un usuario')
      .addUserOption(option =>
        option.setName('usuario')
          .setDescription('Usuario de Discord')
          .setRequired(true))
      .addIntegerOption(option =>
        option.setName('nivel')
          .setDescription('Nuevo nivel')
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(10)));

export async function execute(interaction, client) {
  try {
    await interaction.deferReply({ ephemeral: true });
    
    // Verificar si hay conexión a MongoDB
    if (mongoose.connection.readyState !== 1) {
      return await interaction.editReply({
        content: '❌ No hay conexión a la base de datos. Este comando no está disponible.',
        ephemeral: true
      });
    }
    
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'listar') {
      const page = interaction.options.getInteger('página') || 1;
      const pageSize = 10;
      const skip = (page - 1) * pageSize;
      
      const totalUsers = await User.countDocuments();
      const totalPages = Math.ceil(totalUsers / pageSize);
      
      if (page > totalPages && totalPages > 0) {
        return await interaction.editReply({
          content: `❌ La página ${page} no existe. El total de páginas es ${totalPages}.`,
          ephemeral: true
        });
      }
      
      const users = await User.find()
        .sort({ registrationDate: -1 })
        .skip(skip)
        .limit(pageSize);
      
      if (users.length === 0) {
        return await interaction.editReply({
          content: '❌ No hay usuarios registrados en el sistema.',
          ephemeral: true
        });
      }
      
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📋 Lista de Usuarios Registrados')
        .setDescription(`Mostrando página ${page} de ${totalPages || 1}`)
        .setFooter({ text: `Total de usuarios: ${totalUsers}`, iconURL: interaction.guild.iconURL() })
        .setTimestamp();
      
      users.forEach((user, index) => {
        embed.addFields({
          name: `${skip + index + 1}. ${user.firstName} ${user.lastName}`,
          value: `ID: ${user.userId} | Nivel: ${user.level} | <@${user.discordId}>`
        });
      });
      
      await interaction.editReply({
        embeds: [embed],
        ephemeral: true
      });
    }
    
    else if (subcommand === 'info') {
      const targetUser = interaction.options.getUser('usuario');
      const userData = await User.findOne({ discordId: targetUser.id });
      
      if (!userData) {
        return await interaction.editReply({
          content: `❌ El usuario ${targetUser.username} no está registrado en el sistema.`,
          ephemeral: true
        });
      }
      
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`📝 Información de Usuario: ${userData.firstName} ${userData.lastName}`)
        .setThumbnail(targetUser.displayAvatarURL())
        .addFields(
          { name: 'Discord', value: `<@${userData.discordId}>`, inline: true },
          { name: 'ID de Usuario', value: `${userData.userId}`, inline: true },
          { name: 'Nivel', value: `${userData.level}`, inline: true },
          { name: 'Nombre', value: `${userData.firstName} ${userData.lastName}`, inline: true },
          { name: 'Apodo', value: `${userData.nickname}`, inline: true },
          { name: 'Fecha de Registro', value: new Date(userData.registrationDate).toLocaleDateString(), inline: true }
        )
        .setFooter({ text: `ID de Discord: ${userData.discordId}`, iconURL: interaction.guild.iconURL() })
        .setTimestamp();
      
      await interaction.editReply({
        embeds: [embed],
        ephemeral: true
      });
    }
    
    else if (subcommand === 'nivel') {
      const targetUser = interaction.options.getUser('usuario');
      const newLevel = interaction.options.getInteger('nivel');
      
      const userData = await User.findOne({ discordId: targetUser.id });
      
      if (!userData) {
        return await interaction.editReply({
          content: `❌ El usuario ${targetUser.username} no está registrado en el sistema.`,
          ephemeral: true
        });
      }
      
      const oldLevel = userData.level;
      userData.level = newLevel;
      await userData.save();
      
      // Actualizar roles según el nivel
      const member = await interaction.guild.members.fetch(targetUser.id);
      
      // Definir roles por nivel (ajustar según tus roles)
      const levelRoles = {
        1: 'verificado',
        2: 'comunidad',
        // Añadir más niveles según sea necesario
      };
      
      // Quitar rol anterior si existe
      if (levelRoles[oldLevel]) {
        const oldRole = interaction.guild.roles.cache.find(role => 
          role.name.toLowerCase() === levelRoles[oldLevel]);
        
        if (oldRole && member.roles.cache.has(oldRole.id)) {
          await member.roles.remove(oldRole);
        }
      }
      
      // Añadir nuevo rol si existe
      if (levelRoles[newLevel]) {
        const newRole = interaction.guild.roles.cache.find(role => 
          role.name.toLowerCase() === levelRoles[newLevel]);
        
        if (newRole) {
          await member.roles.add(newRole);
        }
      }
      
      // Imagen para el cambio de nivel
      const nivelImage = new AttachmentBuilder('https://i.ibb.co/YQVtFsK/nivel-actualizado.png', { name: 'nivel.png' });
      
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Nivel Actualizado')
        .setDescription(`El nivel de <@${targetUser.id}> ha sido actualizado.`)
        .addFields(
          { name: 'Usuario', value: `${userData.firstName} ${userData.lastName}`, inline: true },
          { name: 'Nivel Anterior', value: `${oldLevel}`, inline: true },
          { name: 'Nivel Nuevo', value: `${newLevel}`, inline: true }
        )
        .setFooter({ text: `Actualizado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();
      
      await interaction.editReply({
        files: [nivelImage],
        embeds: [embed],
        ephemeral: true
      });
      
      // Notificar en un canal de logs (opcional)
      const logsChannel = interaction.guild.channels.cache.find(channel => 
        channel.name === 'registros' || channel.name === 'logs');
      
      if (logsChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#ffaa00')
          .setTitle('🔄 Nivel de Usuario Actualizado')
          .addFields(
            { name: 'Usuario', value: `<@${targetUser.id}>`, inline: true },
            { name: 'Nivel Anterior', value: `${oldLevel}`, inline: true },
            { name: 'Nivel Nuevo', value: `${newLevel}`, inline: true },
            { name: 'Actualizado por', value: `<@${interaction.user.id}>`, inline: false }
          )
          .setFooter({ text: `ID de Usuario: ${userData.userId}`, iconURL: targetUser.displayAvatarURL() })
          .setTimestamp();
        
        await logsChannel.send({ embeds: [logEmbed] });
      }
    }
    
  } catch (error) {
    console.error('Error al ejecutar el comando usuarios:', error);
    await interaction.editReply({
      content: '❌ Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.',
      ephemeral: true
    });
  }
}