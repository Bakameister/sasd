import { EmbedBuilder } from 'discord.js';

export const customId = 'sasd2';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#2B2D31')
      .setDescription('Es recomendable unirse a la facción ya que es una experiencia única y gratificante. Como en cualquier otra facción, tendrás la oportunidad de vivir experiencias memorables y conocer a personas que comparten tus intereses, lo que enriquecerá tu tiempo en el servidor.\n\n Sin embargo, es importante que seas consciente de que formar parte de esta facción requiere un compromiso firme y una dedicación al estudio del Departamento del Sheriff. El realismo y la precisión en el rol son fundamentales, por lo que se espera que los miembros se tomen en serio su papel y se esfuercen por representar la institución de manera fiel y profesional.\n\n ¿A qué esperar para unirte? Forma parte de algo distinto e innovador dentro de la comunidad SAMP hispanohablante.\n‎ ')
      .setFooter({ text: 'Ingreso a la facción - SASD', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla1:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}