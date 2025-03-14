import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (client) => {
  const slashCommandsPath = path.join(__dirname, '..', 'commands', 'slash');
  const slashCommandFolders = fs.readdirSync(slashCommandsPath);
  
  const commands = [];
  
  console.log('🔄 Cargando comandos slash...');
  
  for (const folder of slashCommandFolders) {
    const folderPath = path.join(slashCommandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = await import(`file://${filePath}`);
      
      if ('data' in command && 'execute' in command) {
        // Store the command in the client's slashCommands collection
        client.slashCommands.set(command.data.name, command);
        
        // For REST API, we need the command data
        const commandData = {
          name: command.data.name,
          description: command.data.description,
          options: command.data.options || [],
          default_member_permissions: command.data.default_member_permissions,
          dm_permission: command.data.dm_permission
        };
        
        commands.push(commandData);
        console.log(`✅ Comando slash cargado: ${command.data.name}`);
      } else {
        console.log(`❌ El comando slash en ${filePath} no tiene las propiedades requeridas.`);
      }
    }
  }
  
  // Registrar comandos slash
  client.once('ready', async () => {
    try {
      console.log('🔄 Actualizando comandos slash...');
      
      const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
      
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      
      console.log('✅ Comandos slash actualizados correctamente.');
    } catch (error) {
      console.error('❌ Error al actualizar comandos slash:', error);
    }
  });
  
  // Evento para comandos slash
  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = client.slashCommands.get(interaction.commandName);
    
    if (!command) return;
    
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error('❌ Error al ejecutar el comando slash:', error);
      
      const replyOptions = {
        content: '❌ Hubo un error al ejecutar este comando.',
        ephemeral: true
      };
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(replyOptions);
      } else {
        await interaction.reply(replyOptions);
      }
    }
  });
  
  console.log('✅ Handler de comandos slash cargado correctamente.');
};