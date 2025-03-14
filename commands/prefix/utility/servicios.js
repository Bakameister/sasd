import { ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder } from 'discord.js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const data = {
  name: 'servicios',
  description: 'Muestra una lista de servicios.',
};

export async function execute(message) {
  try {
    // Cargar la imagen como attachment
  
      const serviciosImage = new AttachmentBuilder('./images/header_servicios.png', { name: 'header_servicios.png' });

    // Crear el menú select
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('servicios_menu')
          .setPlaceholder('Selecciona una categoría')
          .addOptions([
            { label: 'Renta de vehículos', description: 'Servicios de alquiler de vehículos', value: 'vehiculos', emoji: '🚗' },
            { label: 'Drogas', description: 'Información sobre drogas', value: 'drogas', emoji: '💊' },
            { label: 'Armas ilegales', description: 'Catálogo de armas ilegales', value: 'armas', emoji: '🔫' },
            { label: 'Materiales', description: 'Información sobre materiales', value: 'materiales', emoji: '🧰' },
          ]),
      );

    // Enviar los mensajes
    await message.channel.send({ files: [serviciosImage] });
    await message.channel.send('Selecciona la categoría de servicios que deseas consultar:');
    await message.channel.send({ components: [row] });

    // Opcional: Eliminar el mensaje del comando
    if (message.deletable) {
      message.delete().catch(error => {
        console.error('Error al eliminar el mensaje del comando:', error);
      });
    }

  } catch (error) {
    console.error('Error al ejecutar el comando servicios:', error);
    await message.reply('❌ Hubo un error al mostrar los servicios.');
  }
}