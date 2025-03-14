import { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import path from 'path';

export const customId = 'servicios_menu';

// Datos de vehículos (puedes expandir esto)
const vehiculos = [
    {
        nombre: 'Turismo',
        descripcion: 'Un coche deportivo rápido y elegante.',
        imagen: './images/vehículos/turismo.png' // Asegúrate de tener esta imagen
    },
    {
        nombre: 'Bullet',
        descripcion: 'Un vehículo grande y resistente.',
        imagen: './images/vehículos/bullet.png' // Asegúrate de tener esta imagen
    },
    {
        nombre: 'NRG',
        descripcion: 'Una motocicleta clásica y rápida para los amantes de la velocidad.',
        imagen: './images/vehículos/nrg.png' // Asegúrate de tener esta imagen
    },
    {
        nombre: 'Coche Eléctrico',
        descripcion: 'Vehículo ecológico, silencioso y potente.',
        imagen: './images/vehículos/nrg.png' // Asegúrate de tener esta imagen
    },
    // Añade más vehículos aquí
];

export async function execute(interaction, client) {
    try {
        const selected = interaction.values[0];

        switch (selected) {
            case 'vehiculos':
                let currentPage = 0; // Inicia en la primera página

                const generateEmbed = (page) => {
                    const vehiculo = vehiculos[page];
                    if (!vehiculo) {
                        return new EmbedBuilder()
                            .setColor('#FF0000')
                            .setTitle('Error')
                            .setDescription('No hay más vehículos disponibles.');
                    }

                    const attachment = new AttachmentBuilder(vehiculo.imagen, { name: 'turismo.png' });
                    return new EmbedBuilder()
                        .setColor('#0099FF')
                        .setTitle(`Vehículo: ${vehiculo.nombre}`)
                        .setDescription(vehiculo.descripcion)
                       
                        .setFooter({ text: `Página ${page + 1} de ${vehiculos.length}` });
                };

                const generateButtons = (page) => {
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('prev')
                                .setLabel('Anterior')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(page === 0),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('Siguiente')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(page === vehiculos.length - 1)
                        );
                    return row;
                };

                const embed = generateEmbed(currentPage);
                const buttons = generateButtons(currentPage);

                const response = await interaction.reply({
                    embeds: [embed],
                    components: [buttons],
                    files: [new AttachmentBuilder(vehiculos[currentPage].imagen, { name: 'turismo.png' })],
                    ephemeral: true,
                    fetchReply: true // Necesario para editar el mensaje después
                });

                const collector = response.createMessageComponentCollector({ time: 60000 }); // Colector de 60 segundos

                collector.on('collect', async (i) => {
                    if (i.user.id !== interaction.user.id) {
                        return i.reply({ content: 'No puedes controlar esta paginación.', ephemeral: true });
                    }

                    if (i.customId === 'prev' && currentPage > 0) {
                        currentPage--;
                    } else if (i.customId === 'next' && currentPage < vehiculos.length - 1) {
                        currentPage++;
                    }

                    const newEmbed = generateEmbed(currentPage);
                    const newButtons = generateButtons(currentPage);

                    await i.update({ embeds: [newEmbed], components: [newButtons], files: [new AttachmentBuilder(vehiculos[currentPage].imagen, { name: 'turismoo.png' })] });
                });

                collector.on('end', () => {
                    if (response.editable) {
                        interaction.editReply({ components: [] }); // Elimina los botones al finalizar
                    }
                });

                break;

      case 'drogas':
        const drogasEmbed = new EmbedBuilder()
          .setColor('#F44336')
          .setTitle('💊 Drogas')
          .setDescription('Información sobre sustancias ilegales en el servidor.')
          .addFields(
            { name: 'Marihuana', value: 'Precio: $100/g\nEfectos: Regeneración lenta de salud\nDuración: 5 minutos', inline: true },
            { name: 'Cocaína', value: 'Precio: $250/g\nEfectos: Velocidad aumentada\nDuración: 3 minutos', inline: true },
            { name: 'Metanfetamina', value: 'Precio: $350/g\nEfectos: Resistencia al daño\nDuración: 4 minutos', inline: true },
            { name: '⚠️ Advertencia', value: 'El tráfico y consumo de drogas es ilegal. Esta información es solo para fines de roleplay.' }
          )
          .setFooter({ text: 'Recuerda que el meta-gaming está prohibido', iconURL: interaction.guild.iconURL() });
        await interaction.reply({ embeds: [drogasEmbed], ephemeral: true });
        break;

      case 'armas':
        const armasEmbed = new EmbedBuilder()
          .setColor('#9C27B0')
          .setTitle('🔫 Armas Ilegales')
          .setDescription('Catálogo de armas disponibles en el mercado negro.')
          .addFields(
            { name: 'Pistolas', value: 'Precio: $2,000 - $5,000\nMunición: $50/bala\nContacto: Mercado Negro', inline: true },
            { name: 'Subfusiles', value: 'Precio: $8,000 - $12,000\nMunición: $75/bala\nContacto: Traficantes de Armas', inline: true },
            { name: 'Rifles', value: 'Precio: $15,000 - $25,000\nMunición: $100/bala\nContacto: Conexiones Especiales', inline: true },
            { name: '⚠️ Advertencia', value: 'La posesión de armas sin licencia es ilegal. Esta información es solo para fines de roleplay.' }
          )
          .setFooter({ text: 'Los precios pueden variar según la disponibilidad', iconURL: interaction.guild.iconURL() });
        await interaction.reply({ embeds: [armasEmbed], ephemeral: true });
        break;

      case 'materiales':
        const materialesEmbed = new EmbedBuilder()
          .setColor('#2196F3')
          .setTitle('🧰 Materiales')
          .setDescription('Información sobre materiales disponibles para crafting y construcción.')
          .addFields(
            { name: 'Materiales Básicos', value: 'Precio: $50/unidad\nUsos: Reparaciones, construcciones básicas\nDisponibilidad: Alta', inline: true },
            { name: 'Materiales Avanzados', value: 'Precio: $150/unidad\nUsos: Mejoras de armas, vehículos\nDisponibilidad: Media', inline: true },
            { name: 'Materiales Especiales', value: 'Precio: $500/unidad\nUsos: Crafteo de items raros\nDisponibilidad: Baja', inline: true },
            { name: 'Proveedores', value: 'Los materiales pueden obtenerse de minería, reciclaje o comprándolos a proveedores específicos.' }
          )
          .setFooter({ text: 'La calidad de los materiales afecta el resultado final', iconURL: interaction.guild.iconURL() });
        await interaction.reply({ embeds: [materialesEmbed], ephemeral: true });
        break;

      default:
        const defaultEmbed = new EmbedBuilder()
          .setColor('#FF9800')
          .setTitle('❓ Categoría Desconocida')
          .setDescription('La categoría seleccionada no está disponible.')
          .setFooter({ text: 'Por favor, selecciona una categoría válida', iconURL: interaction.guild.iconURL() });
        await interaction.reply({ embeds: [defaultEmbed], ephemeral: true });
        break;
    }
  } catch (error) {
    console.error('Error al ejecutar la interacción del menú de servicios:', error);
    await interaction.reply({
      content: '❌ Hubo un error al procesar tu selección.',
      ephemeral: true,
    });
  }
}