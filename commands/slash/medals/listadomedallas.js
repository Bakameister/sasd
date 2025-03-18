import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Medal from '../../../models/Medal.js';

export const data = new SlashCommandBuilder()
  .setName('listadomedallas')
  .setDescription('Muestra todas las medallas disponibles en el sistema');

export async function execute(interaction) {
  try {
    const medals = await Medal.find({}).sort({ name: 1 });

    if (medals.length === 0) {
      return interaction.reply({
        content: '❌ No hay medallas registradas en el sistema.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🎖️ Listado de Medallas')
      .setDescription(medals.map(medal => 
        `**ID:** ${medal.medalId}\n**Nombre:** ${medal.name}\n**Descripción:** ${medal.description}\n───────────────`
      ).join('\n'));

    return interaction.reply({
      embeds: [embed]
    });
  } catch (error) {
    console.error('Error al mostrar listado de medallas:', error);
    return interaction.reply({
      content: '❌ Hubo un error al mostrar el listado de medallas.',
      ephemeral: true
    });
  }
}