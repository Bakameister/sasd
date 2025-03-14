import { EmbedBuilder } from 'discord.js';

export const customId = 'sasd3';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#2B2D31')
      .setDescription('Antes de unirte al prestigioso cuerpo de San Andreas Sheriff Department (SASD), es necesario pasar por un riguroso periodo de prueba que te brindará las herramientas y conocimientos esenciales para ser parte de nuestra institución.\n\nEn este proceso, los postulantes seleccionados deberán ingresar a nuestra academia, donde se les enseñará todo lo necesario sobre las operaciones, reglas, y principios que guían a nuestra organización.\n\nDurante tu tiempo en la academia, recibirás formación especializada en tácticas de patrullaje, manejo de situaciones de emergencia, conocimiento profundo de las leyes locales, protocolos de seguridad, y el código de conducta que define a cada miembro del SASD.\n\nEste es un periodo crucial para demostrar tu capacidad, compromiso y disposición para servir a la comunidad de San Andreas con profesionalismo y responsabilidad. Solo aquellos que completen con éxito esta formación y demuestren su habilidad para trabajar en equipo y manejar situaciones de alto estrés, serán elegidos para formar parte del cuerpo de SASD.\n‎ ')
      .setFooter({ text: 'Academia - SASD', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla1:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}