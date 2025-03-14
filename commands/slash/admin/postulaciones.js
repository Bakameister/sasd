import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { saveState } from '../../../utils/storage.js';

export const data = new SlashCommandBuilder()
  .setName('postulaciones')
  .setDescription('Gestionar el estado de las postulaciones')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption(option =>
    option
      .setName('estado')
      .setDescription('Estado de las postulaciones')
      .setRequired(true)
      .addChoices(
        { name: 'abrir', value: 'abrir' },
        { name: 'cerrar', value: 'cerrar' }
      )
  );

export async function execute(interaction) {
  try {
    const estado = interaction.options.getString('estado');
    global.postulacionesAbiertas = estado === 'abrir';

    // Guardar el estado actualizado
    await saveState({
      postulacionesAbiertas: global.postulacionesAbiertas,
      mensajeEstadoPostulacionesId: global.mensajeEstadoPostulacionesId,
      mensajeEstadoChannelId: global.mensajeEstadoChannelId
    });

    // Actualiza el mensaje si existe
    if (global.mensajeEstadoPostulacionesId && global.mensajeEstadoChannelId) {
      const channel = interaction.client.channels.cache.get(global.mensajeEstadoChannelId);
      if (channel) {
        try {
          const mensaje = await channel.messages.fetch(global.mensajeEstadoPostulacionesId);
          if (mensaje) {
            const statusEmbed = new EmbedBuilder()
              .setColor(global.postulacionesAbiertas ? '#00ff00' : '#ff0000')
              .setDescription(global.postulacionesAbiertas
                ? `\`\`\`less\nPOSTULACIONES ABIERTAS\n\`\`\`\n`
                : `\`\`\`ml\nPOSTULACIONES CERRADAS\n\`\`\`\n`);

            await mensaje.edit({ embeds: [statusEmbed] });
          }
        } catch (error) {
          console.error('Error al actualizar el mensaje de estado:', error);
        }
      }
    }

    await interaction.reply({
      content: `Las postulaciones han sido ${global.postulacionesAbiertas ? 'abiertas' : 'cerradas'}.`,
      ephemeral: true
    });

  } catch (error) {
    console.error('Error al ejecutar el comando postulaciones:', error);
    await interaction.reply({
      content: 'Hubo un error al cambiar el estado de las postulaciones.',
      ephemeral: true
    });
  }
}