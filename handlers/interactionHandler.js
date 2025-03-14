import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (client) => {
   // Cargar interacciones de botones (desde las carpetas normativa y decálogo)
  const buttonsPath = path.join(__dirname, '..', 'interactions', 'buttons');
  const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
  const normativaPath = path.join(buttonsPath, 'normativa');
  const decalogoPath = path.join(buttonsPath, 'decálogo');
  const sasdPath = path.join(buttonsPath, 'postulaciones');

  const normativaFiles = fs.readdirSync(normativaPath).filter(file => file.endsWith('.js'));
  const decalogoFiles = fs.readdirSync(decalogoPath).filter(file => file.endsWith('.js'));
  const postulacionesFiles = fs.readdirSync(sasdPath).filter(file => file.endsWith('.js'));

  console.log('🔄 Cargando interacciones de botones...');
  
  // Cargar botones de la carpeta normativa
  for (const file of normativaFiles) {
    const filePath = path.join(normativaPath, file);
    const button = await import(`file://${filePath}`);
    
    if ('customId' in button && 'execute' in button) {
      client.buttons.set(button.customId, button);
      console.log(`✅ Interacción de botón cargada: ${button.customId}`);
    } else {
      console.log(`❌ La interacción de botón en ${filePath} no tiene las propiedades requeridas.`);
    }
  }

  // Cargar botones de la carpeta decálogo
  for (const file of postulacionesFiles) {
    const filePath = path.join(sasdPath, file);
    const button = await import(`file://${filePath}`);
    
    if ('customId' in button && 'execute' in button) {
      client.buttons.set(button.customId, button);
      console.log(`✅ Interacción de botón cargada: ${button.customId}`);
    } else {
      console.log(`❌ La interacción de botón en ${filePath} no tiene las propiedades requeridas.`);
    }
  }

  // Cargar botones de la carpeta decálogo
  for (const file of decalogoFiles) {
    const filePath = path.join(decalogoPath, file);
    const button = await import(`file://${filePath}`);
    
    if ('customId' in button && 'execute' in button) {
      client.buttons.set(button.customId, button);
      console.log(`✅ Interacción de botón cargada: ${button.customId}`);
    } else {
      console.log(`❌ La interacción de botón en ${filePath} no tiene las propiedades requeridas.`);
    }
  }
  
  // Cargar interacciones de menús de selección
  const selectMenusPath = path.join(__dirname, '..', 'interactions', 'selectMenus');
  const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));
  
  console.log('🔄 Cargando interacciones de menús de selección...');
  
  for (const file of selectMenuFiles) {
    const filePath = path.join(selectMenusPath, file);
    const selectMenu = await import(`file://${filePath}`);
    
    if ('customId' in selectMenu && 'execute' in selectMenu) {
      client.selectMenus.set(selectMenu.customId, selectMenu);
      console.log(`✅ Interacción de menú de selección cargada: ${selectMenu.customId}`);
    } else {
      console.log(`❌ La interacción de menú de selección en ${filePath} no tiene las propiedades requeridas.`);
    }
  }
  
  // Evento para interacciones
  client.on('interactionCreate', async interaction => {
    // Manejo de botones
    if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      
      if (!button) return;
      
      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.error('❌ Error al ejecutar la interacción de botón:', error);
        await interaction.reply({
          content: '❌ Hubo un error al procesar esta interacción.',
          ephemeral: true
        }).catch(console.error);
      }
    }
    
    // Manejo de menús de selección
    if (interaction.isStringSelectMenu()) {
      const selectMenu = client.selectMenus.get(interaction.customId);
      
      if (!selectMenu) return;
      
      try {
        await selectMenu.execute(interaction, client);
      } catch (error) {
        console.error('❌ Error al ejecutar la interacción de menú de selección:', error);
        await interaction.reply({
          content: '❌ Hubo un error al procesar esta interacción.',
          ephemeral: true
        }).catch(console.error);
      }
    }
  });
  
  console.log('✅ Handler de interacciones cargado correctamente.');
};