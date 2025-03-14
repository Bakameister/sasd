import { EmbedBuilder } from 'discord.js';

export const data = {
  name: 'help',
  description: 'Muestra la lista de comandos disponibles',
};

export async function execute(message, args, client) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📚 Comandos Disponibles')
      .setDescription(`Prefijo actual: \`${client.prefix}\``)
      .setTimestamp()
      .setFooter({ text: `Solicitado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
    
    // Agrupar comandos por carpetas
    const commandsByCategory = {};
    
    for (const [name, command] of client.commands) {
      // Obtener la categoría del comando basado en su ruta
      const filePath = command.filePath || 'Sin categoría';
      const category = filePath.split('/').slice(-2)[0] || 'Sin categoría';
      
      if (!commandsByCategory[category]) {
        commandsByCategory[category] = [];
      }
      
      commandsByCategory[category].push(`\`${name}\` - ${command.data.description}`);
    }
    
    // Añadir campos al embed para cada categoría
    for (const [category, commands] of Object.entries(commandsByCategory)) {
      embed.addFields({
        name: `${category.charAt(0).toUpperCase() + category.slice(1)}`,
        value: commands.join('\n') || 'No hay comandos en esta categoría.',
        inline: false
      });
    }
    
    await message.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error al ejecutar el comando help:', error);
    await message.reply('❌ Hubo un error al mostrar la ayuda.');
  }
}