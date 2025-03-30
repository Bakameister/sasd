import { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import { initializeStorage, loadState } from './utils/storage.js';
import { connectToDatabase } from './utils/database.js';
import { setupMessageHandler } from './interactions/selectMenus/sasd_menu.js';

// Configuración
config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear cliente
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

// Inicializa las colecciones para modales
client.modals = new Collection();
client.modalSubmits = new Collection();


// Variables globales iniciales
global.postulacionesAbiertas = false;
global.mensajeEstadoPostulacionesId = null;
global.mensajeEstadoChannelId = null;

// Colecciones para comandos
client.commands = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.prefix = process.env.PREFIX;

// Función para cargar los handlers
const loadHandlers = async () => {
  const handlersPath = path.join(__dirname, 'handlers');
  const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));
  
  console.log('🔄 Cargando handlers...');
  
  for (const file of handlerFiles) {
    const filePath = path.join(handlersPath, file);
    const handlerModule = await import(`file://${filePath}`);
    
    if ('default' in handlerModule) {
      await handlerModule.default(client);
    }
    
    console.log(`✅ Handler cargado: ${file}`);
  }
};

// Función para actualizar el mensaje de estado
async function updateStatusMessage(client) {
  if (global.mensajeEstadoPostulacionesId && global.mensajeEstadoChannelId) {
    try {
      const channel = await client.channels.fetch(global.mensajeEstadoChannelId);
      if (channel) {
        const mensaje = await channel.messages.fetch(global.mensajeEstadoPostulacionesId);
        if (mensaje) {
          const statusEmbed = new EmbedBuilder()
            .setColor(global.postulacionesAbiertas ? '#00ff00' : '#ff0000')
            .setDescription(global.postulacionesAbiertas
              ? `\`\`\`less\nPOSTULACIONES ABIERTAS\n\`\`\`\n`
              : `\`\`\`ml\nPOSTULACIONES CERRADAS\n\`\`\`\n`);
          

          await mensaje.edit({ embeds: [statusEmbed] });
          console.log('✅ Mensaje de estado actualizado correctamente');
        }
      }
    } catch (error) {
      console.error('❌ Error al actualizar el mensaje de estado:', error);
    }
  }
}

// Iniciar bot
(async () => {
  try {

    // Conectar a la base de datos MongoDB (ahora maneja el caso de URI indefinida)
    const dbConnected = await connectToDatabase();
    
    if (!dbConnected) {
      console.log('⚠️ Continuando sin funcionalidades de base de datos');
    }
    // Inicializar almacenamiento local
    await initializeStorage();
    
    // Cargar estado guardado
    const savedState = await loadState();
    global.postulacionesAbiertas = savedState.postulacionesAbiertas;
    global.mensajeEstadoPostulacionesId = savedState.mensajeEstadoPostulacionesId;
    global.mensajeEstadoChannelId = savedState.mensajeEstadoChannelId;
    
    console.log(`📂 Estado de postulaciones cargado: ${global.postulacionesAbiertas ? 'ABIERTAS' : 'CERRADAS'}`);
    
    // Cargar handlers
    await loadHandlers();
    
    // Evento ready
    client.once('ready', async () => {
      console.log(`🤖 Bot conectado como ${client.user.tag}`);
      console.log(`🔗 Enlace de invitación: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`);
      
      // Actualizar el mensaje de estado cuando el bot esté listo
      await updateStatusMessage(client);
    

        
      // Inicializa el message handler
            setupMessageHandler(client); // Añade esta línea aquí
        });
    
    // Iniciar sesión
    await client.login(process.env.TOKEN);
  } catch (error) {
    console.error('❌ Error al iniciar el bot:', error);
  }
})();

// Manejo de errores no capturados
process.on('unhandledRejection', error => {
  console.error('❌ Error no manejado:', error);
});