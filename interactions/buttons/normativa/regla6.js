import { EmbedBuilder } from 'discord.js';

export const customId = 'regla6';

export async function execute(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#ff5555')
      .setTitle('📑 Regla 6: Respeto a la jerarquía')
      .setDescription('Se debe respetar la cadena de mando establecida. Las órdenes de superiores deben ser acatadas a menos que contradigan otras reglas fundamentales.')
      .addFields(
        { name: 'Desacuerdos', value: 'Los desacuerdos deben manejarse en privado o a través de los canales oficiales, nunca mediante insubordinación pública.' },
        { name: 'Excepciones', value: 'Órdenes que impliquen romper reglas del servidor o que pongan en riesgo innecesario a la organización.' }
      )
      .setFooter({ text: 'Normativa del servidor', iconURL: interaction.guild.iconURL() });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error('Error al ejecutar la interacción del botón regla6:', error);
    await interaction.reply({ content: '❌ Hubo un error al mostrar la regla.', ephemeral: true });
  }
}