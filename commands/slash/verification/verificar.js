import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import mongoose from 'mongoose';
import { generateUniqueUserId, formatName, containsOnlyLetters } from '../../../utils/database.js';

export const data = new SlashCommandBuilder()
  .setName('verificar')
  .setDescription('Registra un usuario en el sistema')
  .addStringOption(option =>
    option.setName('nombre')
      .setDescription('Tu nombre (solo letras)')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('apellido')
      .setDescription('Tu apellido (solo letras)')
      .setRequired(true));

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

    const { user, guild, member } = interaction;
    let firstName = interaction.options.getString('nombre');
    let lastName = interaction.options.getString('apellido');

    // Validar que solo contengan letras
    if (!containsOnlyLetters(firstName) || !containsOnlyLetters(lastName)) {
      return await interaction.editReply({
        content: '❌ El nombre y apellido solo pueden contener letras.',
        ephemeral: true
      });
    }

    // Formatear nombre y apellido (primera letra mayúscula, resto minúscula)
    firstName = formatName(firstName);
    lastName = formatName(lastName);

    // Importar el modelo User
    const User = mongoose.models.User;

    // Verificar si el usuario ya está registrado
    const existingUser = await User.findOne({ discordId: user.id });

    if (existingUser) {
      return await interaction.editReply({
        content: '❌ Ya estás registrado en el sistema.',
        ephemeral: true
      });
    }

    // Generar ID único para el usuario
    const userId = await generateUniqueUserId();

    // Crear nuevo usuario en la base de datos
    const newUser = new User({
      discordId: user.id,
      username: user.username,
      nickname: `${firstName} ${lastName}`,
      firstName,
      lastName,
      userId,
      level: 1,
      registrationDate: new Date()
    });

    await newUser.save();

    // Cambiar el apodo del usuario
    try {
      await member.setNickname(`${firstName} ${lastName}`);
    } catch (error) {
      console.warn(`No se pudo cambiar el apodo de ${user.tag}: ${error.message}`);
    }

    // Asignar rol de verificado (nivel 1)
    const verificadoRole = guild.roles.cache.find(role =>
      role.name.toLowerCase() === 'verificado');

    if (verificadoRole) {
      await member.roles.add(verificadoRole);
    } else {
      console.warn('⚠️ No se encontró el rol "verificado"');
    }

    // Desbloquear canales específicos
    const channelsToUnlock = ['﹙👔﹚𝖳𝗋𝖺𝖻𝖺𝗃𝗈𝗌', '﹙📝﹚𝖯𝗈𝗌𝗍𝗎𝗅𝖺𝖼𝗂𝗈𝗇𝖾𝗌'];

    for (const channelName of channelsToUnlock) {
      const channel = guild.channels.cache.find(c => c.name === channelName);
      if (channel) {
        await channel.permissionOverwrites.create(verificadoRole, {
          ViewChannel: true,
          SendMessages: true
        });
      } else {
        console.warn(`⚠️ No se encontró el canal "${channelName}"`);
      }
    }

    // Imagen para el registro
    const registroImage = new AttachmentBuilder('./images/verificar.png', { name: 'verificar.png' });

 const registroDate = new Date().toLocaleDateString();

    // Crear embed de confirmación
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('REGISTRO COMPLETADO')
      .setDescription(`Bienvenido a Denver Family **${firstName} ${lastName}**, has desbloqueado:\n<#1344689016091705465>\n<#1345012629403336764>\n`)
      .addFields(
        { name: 'ID', value: `\`\`\`fix\n${userId}\n\`\`\``, inline: true },
        { name: 'NIVEL', value: `\`\`\`fix\n1\n\`\`\``, inline: true },
        { name: 'FECHA DE REGISTRO', value: `\`\`\`fix\n${registroDate}\n\`\`\``, inline: true },
        { name: '‎NÚMERO DE PASAPORTE', value: `\`\`\`fix\n${user.id}\n\`\`\``, inline: true },
        { name: '‎‎ ', value: `\`\`\`less\nVERIFICADO\n\`\`\``, inline: true}  
      );
      
// Enviar el mensaje al usuario por DM
try {
  await user.send({
    files: [registroImage],
    embeds: [embed]
  });
} catch (error) {
  console.warn(`No se pudo enviar el mensaje directo a ${user.tag}: ${error.message}`);
  // Puedes agregar aquí un mensaje al canal para notificar al usuario que revise sus DMs
}

    await interaction.editReply({
      files: [registroImage],
      embeds: [embed],
      ephemeral: true
    });

    // Notificar en un canal de logs (opcional)
    const logsChannel = guild.channels.cache.find(channel =>
      channel.name === '2' || channel.name === '1');

    if (logsChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('‎NUEVO USUARIO REGISTRADO')
.setDescription('Comandos disponibles:\n`/usuarios info` `/usuarios listar` `/usuarios nivel`')
        .addFields(
          { name: '‎ ', value: `<@${user.id}>`, inline: false },
          { name: 'CIUDADANO', value: `\`\`\`fix\n${firstName} ${lastName}\n\`\`\``, inline: true },
          { name: 'ID', value: `\`\`\`fix\n${userId}\n\`\`\``, inline: true },
          { name: 'PASAPORTE', value: `\`\`\`fix\n${user.id}\n\`\`\``, inline: false }
        );

      await logsChannel.send({ embeds: [logEmbed] });
    }

  } catch (error) {
    console.error('Error al ejecutar el comando verificar:', error);
    await interaction.editReply({
      content: '❌ Hubo un error al procesar tu registro. Por favor, inténtalo de nuevo más tarde.',
      ephemeral: true
    });
  }
}