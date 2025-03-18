import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Plate from '../../../models/Plate.js';

export const data = new SlashCommandBuilder()
  .setName('listadoplacas')
  .setDescription('Muestra todas las placas disponibles en el sistema');

export async function execute(interaction) {
  try {
    const plates = await Plate.find({}).sort({ name: 1 });

    if (plates.length === 0) {
      return interaction.reply({
        content: '❌ No hay placas registradas en el sistema.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📋 Listado de Placas')
      .setDescription(plates.map(plate => {
        const role = interaction.guild.roles.cache.get(plate.roleId);
        return `**ID:** ${plate.plateId}\n**Nombre:** ${plate.name}\n**Rol:** ${role ? role.name : 'Rol no encontrado'}\n───────────────`;
      }).join('\n'));

    return interaction.reply({
      embeds: [embed]
    });
  } catch (error) {
    console.error('Error al mostrar listado de placas:', error);
    return interaction.reply({
      content: '❌ Hubo un error al mostrar el listado de placas.',
      ephemeral: true
    });
  }
}