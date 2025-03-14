import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (client) => {
  // Cargar comandos prefix
  const commandsPath = path.join(__dirname, '..', 'commands', 'prefix');
  const commandFolders = fs.readdirSync(commandsPath);
  
  console.log('🔄 Cargando comandos prefix...');
  
  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = await import(`file://${filePath}`);
      
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Comando prefix cargado: ${command.data.name}`);
      } else {
        console.log(`❌ El comando en ${filePath} no tiene las propiedades requeridas.`);
      }
    }
  }
  
  // Evento para comandos prefix
  client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(client.prefix)) return;
    
    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName);
    
    if (!command) return;
    
    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error('❌ Error al ejecutar el comando prefix:', error);
      await message.reply('❌ Hubo un error al ejecutar el comando.').catch(console.error);
    }
  });
  
  console.log('✅ Handler de comandos prefix cargado correctamente.');
};