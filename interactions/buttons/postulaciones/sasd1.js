import { EmbedBuilder } from 'discord.js';

export const customId = 'sasd1';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#2B2D31')
      .setDescription('Dentro de la comunidad de NewGamers, la facción del Departamento del Sheriff del Condado de Los Ángeles (LASD) se interpreta con un alto grado de fidelidad a su contraparte en la vida real, recibiendo esta el nombre de SASD (San Andreas Sheriff Department). La misión principal de esta facción es incrementar gradualmente la presencia policial en el servidor, asegurando que los usuarios comprendan y se involucren en el rol policial correspondiente a esta agencia de manera realista. Este enfoque busca no solo emular las operaciones y responsabilidades de LASD, sino también educar a los jugadores sobre las prácticas y procedimientos policiales, creando una experiencia inmersiva y divertida que se basa en el realismo.\n\n Para lograr esto, la facción cuenta con cuatro divisiones habilitadas: la Professional Standards Division, la Special Operations Division, la Administrative Services Division, y la Patrol Division. Cada una de estas divisiones desempeña un papel específico en la estructura operativa de SASD, proporcionando a los miembros de la comunidad una variedad de experiencias y responsabilidades dentro del juego.\n\n Además, la facción también incluye seis bureaus habilitadas: la Internal Affairs Bureau, Operation Safe Streets Bureau, el Special Enforcement Bureau, la Aero Bureau, la Documentation Bureau, y la Public Relations Bureau. Estas unidades especializadas permiten a los miembros explorar diferentes aspectos del trabajo policial, alejándose de la rutina habitual y accediendo a actividades que se alinean con sus intereses. Esto no solo enriquece la experiencia de juego, sino que también apoya la creación de nuevos roles y dinámicas dentro de la comunidad, fomentando un ambiente de constante evolución y aprendizaje.\n‎ ')
      .setFooter({ text: 'Interpretación de Rol - SASD', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla1:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}