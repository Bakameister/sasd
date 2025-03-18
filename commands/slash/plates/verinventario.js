import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'path';
import { fileURLToPath } from 'url';
import Plate from '../../../models/Plate.js';
import UserPlate from '../../../models/UserPlate.js';
import Medal from '../../../models/Medal.js';
import UserMedal from '../../../models/UserMedal.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const data = new SlashCommandBuilder()
    .setName('verinventario')
    .setDescription('Muestra el inventario de placas y medallas de un usuario')
    .addUserOption(option =>
        option.setName('usuario')
            .setDescription('Usuario del que se quiere ver el inventario')
            .setRequired(true)
    );

async function createInventoryImage(user, plates, medals) {
    const totalItems = plates.length + medals.length;
    const ITEMS_PER_ROW = 4;
    const ITEM_SIZE = 150;
    const PADDING = 20;
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = Math.max(400, Math.ceil(totalItems / ITEMS_PER_ROW) * 200);

    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = canvas.getContext('2d');

    // Fondo principal
    ctx.fillStyle = '#2C2F33';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Barra superior
    ctx.fillStyle = '#7289DA';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 80);

    // Avatar del usuario
    const avatar = await loadImage(user.displayAvatarURL({ extension: 'png', size: 128 }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(50, 40, 30, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 20, 10, 60, 60);
    ctx.restore();

    // Título y contadores
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Inventario de ${user.username}`, 100, 45);

    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Placas: ${plates.length} | Medallas: ${medals.length}`, CANVAS_WIDTH - 250, 45);

    // Combinar placas y medallas
    const allItems = [
        ...plates.map(item => ({
            name: item.name,
            imageUrl: path.join(process.cwd(), 'images', 'placas', `${item.plateId}.png`),
            type: 'plate'
        })),
        ...medals.map(item => ({
            name: item.name,
            imageUrl: path.join(process.cwd(), 'images', 'medallas', `${item.medalId}.png`),
            type: 'medal',
            description: item.description
        }))
    ];

    // Dibujar items
    for (let i = 0; i < allItems.length; i++) {
        const item = allItems[i];
        const row = Math.floor(i / ITEMS_PER_ROW);
        const col = i % ITEMS_PER_ROW;
        const x = col * (ITEM_SIZE + PADDING) + PADDING;
        const y = row * (ITEM_SIZE + PADDING) + 100;

        try {
            // Fondo del item
            ctx.fillStyle = item.type === 'plate' ? '#36393F' : '#3F3936';
            ctx.fillRect(x, y, ITEM_SIZE, ITEM_SIZE);

            // Barra lateral indicadora
            ctx.fillStyle = item.type === 'plate' ? '#7289DA' : '#FFD700';
            ctx.fillRect(x, y, 5, ITEM_SIZE);

            // Cargar y dibujar imagen
            console.log(`📷 Intentando cargar imagen desde: ${item.imageUrl}`);
            const itemImage = await loadImage(item.imageUrl);
            ctx.drawImage(itemImage, x + 10, y + 5, ITEM_SIZE - 20, ITEM_SIZE - 40);

            // Nombre del item
            ctx.font = '14px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(item.name, x + 10, y + ITEM_SIZE - 10, ITEM_SIZE - 20);

            // Descripción para medallas
            if (item.type === 'medal' && item.description) {
                ctx.font = '12px Arial';
                ctx.fillStyle = '#AAAAAA';
                ctx.fillText(item.description, x + 10, y + ITEM_SIZE - 25, ITEM_SIZE - 20);
            }
        } catch (error) {
            console.error(`❌ Error cargando imagen para ${item.name}:`, error);
            // Dibujar placeholder para items con error
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(x + 10, y + 5, ITEM_SIZE - 20, ITEM_SIZE - 40);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('Error', x + 10, y + ITEM_SIZE - 10);
        }
    }

    return canvas.encode('png');
}

export async function execute(interaction) {
    await interaction.deferReply();
    const targetUser = interaction.options.getUser('usuario');

    try {
        // Obtener placas del usuario
        const userPlates = await UserPlate.find({ userId: targetUser.id });
        const plateIds = userPlates.map(up => up.plateId);
        const plates = await Plate.find({ plateId: { $in: plateIds } });

        // Obtener medallas del usuario
        const userMedals = await UserMedal.find({ userId: targetUser.id });
        const medalIds = userMedals.map(um => um.medalId);
        const medals = await Medal.find({ medalId: { $in: medalIds } });

        if (plates.length === 0 && medals.length === 0) {
            return interaction.editReply({
                content: `${targetUser.username} no tiene placas ni medallas.`
            });
        }

        const inventoryBuffer = await createInventoryImage(targetUser, plates, medals);
        const attachment = new AttachmentBuilder(inventoryBuffer, { name: 'inventory.png' });

        await interaction.editReply({
            content: `🏆 Inventario de ${targetUser.username}`,
            files: [attachment]
        });
    } catch (error) {
        console.error('❌ Error al generar inventario:', error);
        return interaction.editReply({
            content: '❌ Hubo un error al mostrar el inventario.'
        });
    }
}