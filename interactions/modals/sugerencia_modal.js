import { EmbedBuilder } from 'discord.js';

export const customId = 'sugerencia_modal';

export async function execute(interaction) {
    const sugerencia = interaction.fields.getTextInputValue('sugerencia_titulo');
    const descripcion = interaction.fields.getTextInputValue('sugerencia_descripcion');
    const time = new Date().toLocaleTimeString('es-ES', { hour12: false });

    // Canal principal de sugerencias
    const sugerenciasChannel = interaction.guild.channels.cache.get('1345012629403336764');
    // Canal de logs resumidos
    const logsChannel = interaction.guild.channels.cache.get('1344689016091705465');

    if (sugerenciasChannel && logsChannel) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Nueva Sugerencia')
            .setDescription(`**Sugerencia:** ${sugerencia}\n\n**Descripción:** ${descripcion}`)
            .setFooter({ text: `Sugerido por ${interaction.user.tag}` })
            .setTimestamp();

        await sugerenciasChannel.send({ embeds: [embed] });
        await logsChannel.send(`[${time}] Nueva sugerencia creada por ${interaction.user.tag}`);
        
        await interaction.reply({ 
            content: '✅ Tu sugerencia ha sido enviada correctamente.',
            ephemeral: true 
        });
    } else {
        await interaction.reply({ 
            content: '❌ Error al enviar la sugerencia. Canales no encontrados.',
            ephemeral: true 
        });
    }
}