import { EmbedBuilder } from 'discord.js';

export const customId = 'deca1';

export async function execute(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true }); // Diferir la respuesta inicialmente
        const embed = new EmbedBuilder()
            .setColor('#ff5555')
            .setTitle('DEBER DE RESPETO')
            .setDescription('Todos los miembros deben respetarse entre sí, sin importar antigüedad o rango. No se permite discriminación ni acoso por etnia, género, orientación sexual, condición socioeconómica, nacionalidad, edad, religión, tendencia política, habilidad en el juego, etcétera.');

        await interaction.editReply({ embeds: [embed] }); // Editar la respuesta diferida
    } catch (error) {
        console.error('Error al ejecutar la interacción del botón regla1:', error);
        await interaction.editReply({ content: '❌ Hubo un error al mostrar la regla.' }); // Editar la respuesta diferida con el error
    }
}