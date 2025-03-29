import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';

export const data = {
  name: 'menusasd',
  description: 'Muestra el menú de opciones SASD.',
};

export async function execute(message) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Sistema de Asistencia SASD')
      .setDescription('Por favor, selecciona una opción:')
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('sasd_menu')
          .setPlaceholder('Selecciona una opción')
          .addOptions([
            {
              label: 'Denuncias',
              description: 'Realizar una denuncia formal',
              value: 'denuncias',
              emoji: '📝'
            },
            {
              label: 'Sugerencias',
              description: 'Enviar una sugerencia',
              value: 'sugerencias',
              emoji: '💡'
            },
            {
              label: 'Ayuda general',
              description: 'Solicitar ayuda general',
              value: 'ayuda',
              emoji: '❓'
            }
          ])
      );

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });

  } catch (error) {
    console.error('Error al ejecutar el comando menusasd:', error);
    await message.reply('❌ Hubo un error al mostrar el menú.');
  }
}