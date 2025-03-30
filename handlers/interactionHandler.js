import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (client) => {
    // Inicializar colecciones si no existen
    client.modals = client.modals || new Map();
    client.modalSubmits = client.modalSubmits || new Map();

    // Crear directorios si no existen
    const createDirIfNotExists = (dirPath) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    };

    const interactionsPath = path.join(__dirname, '..', 'interactions');
    const buttonsPath = path.join(interactionsPath, 'buttons');
    const modalsPath = path.join(interactionsPath, 'modals');
    const selectMenusPath = path.join(interactionsPath, 'selectMenus');

    [interactionsPath, buttonsPath, modalsPath, selectMenusPath].forEach(createDirIfNotExists);

    // Cargar interacciones de botones
    const normativaPath = path.join(buttonsPath, 'normativa');
    const decalogoPath = path.join(buttonsPath, 'decálogo');
    const sasdPath = path.join(buttonsPath, 'postulaciones');

    [normativaPath, decalogoPath, sasdPath].forEach(createDirIfNotExists);

    console.log('🔄 Cargando interacciones de botones...');

    // Función auxiliar para cargar botones
    const loadButtons = async (dirPath) => {
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'));
            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const button = await import(`file://${filePath}`);
                
                if ('customId' in button && 'execute' in button) {
                    client.buttons.set(button.customId, button);
                    console.log(`✅ Interacción de botón cargada: ${button.customId}`);
                }
            }
        }
    };

    // Cargar botones de todas las carpetas
    await loadButtons(normativaPath);
    await loadButtons(decalogoPath);
    await loadButtons(sasdPath);

    // Cargar interacciones de menús de selección
    console.log('🔄 Cargando interacciones de menús de selección...');
    
    if (fs.existsSync(selectMenusPath)) {
        const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));
        
        for (const file of selectMenuFiles) {
            const filePath = path.join(selectMenusPath, file);
            const selectMenu = await import(`file://${filePath}`);
            
            if ('customId' in selectMenu && 'execute' in selectMenu) {
                client.selectMenus.set(selectMenu.customId, selectMenu);
                console.log(`✅ Interacción de menú de selección cargada: ${selectMenu.customId}`);
            }
        }
    }

    // Cargar interacciones de modales
    console.log('🔄 Cargando interacciones de modales...');
    
    if (fs.existsSync(modalsPath)) {
        const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));
        
        for (const file of modalFiles) {
            const filePath = path.join(modalsPath, file);
            const modal = await import(`file://${filePath}`);
            
            if ('customId' in modal && 'execute' in modal) {
                client.modals.set(modal.customId, modal);
                console.log(`✅ Interacción de modal cargada: ${modal.customId}`);
            }
        }
    }

    // Evento para interacciones
    client.on('interactionCreate', async interaction => {
        try {
            // Manejo de botones
            if (interaction.isButton()) {
                const button = client.buttons.get(interaction.customId);
                if (button) {
                    await button.execute(interaction, client);
                }
            }
            
            // Manejo de menús de selección
            if (interaction.isStringSelectMenu()) {
                const selectMenu = client.selectMenus.get(interaction.customId);
                if (selectMenu) {
                    await selectMenu.execute(interaction, client);
                }
            }

            // Manejo de modales
            if (interaction.isModalSubmit()) {
                const modal = client.modals.get(interaction.customId);
                if (modal) {
                    await modal.execute(interaction, client);
                }
            }
        } catch (error) {
            console.error('❌ Error al manejar la interacción:', error);
            const reply = {
                content: '❌ Hubo un error al procesar esta interacción.',
                ephemeral: true
            };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(reply);
            } else {
                await interaction.reply(reply);
            }
        }
    });

    console.log('✅ Handler de interacciones cargado correctamente.');
};