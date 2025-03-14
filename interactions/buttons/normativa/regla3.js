import { EmbedBuilder } from 'discord.js';

export const customId = 'regla3';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#ff5555')
      .setTitle('📑 Regla 3: Comportamientos tóxicos')
      .setDescription('No se tolerarán comportamientos tóxicos como acoso, discriminación, amenazas o cualquier forma de conducta que genere un ambiente hostil.')
      .addFields(
        { name: 'Definición', value: 'Se considera comportamiento tóxico cualquier acción que busque deliberadamente molestar, ofender o perjudicar a otros usuarios.' },
        { name: 'Consecuencias', value: 'Las infracciones graves pueden resultar en expulsión inmediata sin posibilidad de apelación.' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla3:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}