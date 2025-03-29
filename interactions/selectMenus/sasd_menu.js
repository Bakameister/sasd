import { EmbedBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import Canvas from '@napi-rs/canvas';

export const customId = 'sasd_menu';

const tiposDenuncia = [
    { label: 'Robo', value: 'robo' },
    { label: 'Acoso', value: 'acoso' },
    { label: 'Agresión', value: 'agresion' },
    { label: 'Vandalismo', value: 'vandalismo' },
    { label: 'Otro', value: 'otro' }
];

const preguntas = {
    denunciante: '¿Cuál es tu nombre y apellido?',
    denunciado: '¿Cuál es el nombre y apellido del denunciado (si lo conoces)?',
    tipo: '¿Qué tipo de denuncia deseas realizar?',
    descripcion: 'Por favor, describe el incidente en detalle:',
    evidencias: 'Por favor, proporciona evidencias y testigos (si los hay):'
};

const respuestas = new Map();

async function crearSello() {
    const canvas = Canvas.createCanvas(200, 100);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0000FF';
    ctx.font = '20px Arial';
    ctx.fillText('APROBADO', 50, 50);
    ctx.font = '12px Arial';
    ctx.fillText(new Date().toLocaleDateString(), 60, 70);

    return canvas.toBuffer();
}

async function crearPDF(datos, estado = null) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const tempPath = path.join(process.cwd(), 'temp');

            if (!fs.existsSync(tempPath)) {
                fs.mkdirSync(tempPath);
            }

            const filename = `${Date.now()}_2025.pdf`;
            const filepath = path.join(tempPath, filename);

            const stream = fs.createWriteStream(filepath);
            doc.pipe(stream);

            // Encabezado
            doc.fontSize(24).text('FORMULARIO DE DENUNCIA', { align: 'center' }).moveDown();

            // Agregar preguntas y respuestas
            doc.fontSize(14).text('1. Denunciante:', { bold: true }).moveDown();
            doc.fontSize(12).text(`   ${datos.denunciante}`).moveDown();

            doc.fontSize(14).text('2. Denunciado:', { bold: true }).moveDown();
            doc.fontSize(12).text(`   ${datos.denunciado}`).moveDown();

            doc.fontSize(14).text('3. Tipo de denuncia:', { bold: true }).moveDown();
            doc.fontSize(12).text(`   ${datos.tipo}`).moveDown();

            doc.fontSize(14).text('4. Descripción del incidente:', { bold: true }).moveDown();
            doc.fontSize(12).text(`   ${datos.descripcion}`).moveDown();

            doc.fontSize(14).text('5. Evidencias y testigos:', { bold: true }).moveDown();
            doc.fontSize(12).text(`   ${datos.evidencias}`).moveDown();

            // Agregar estado si existe
            if (estado) {
                doc.moveDown(2);
                crearSello().then(selloBuffer => {
                    doc.image(selloBuffer, doc.page.width - 250, doc.y, { width: 200, height: 100 });
                    doc.moveDown();
                    doc.fontSize(16).text(estado, { align: 'right' });
                    doc.end();
                });
            } else {
                doc.end();
            }

            stream.on('finish', () => {
                console.log('✅ PDF generado:', filepath);
                resolve(filepath);
            });

            stream.on('error', reject);
        } catch (error) {
            console.error('❌ Error al generar el PDF:', error);
            reject(error);
        }
    });
}

async function manejarDenuncia(interaction) {
    const userId = interaction.user.id;

    const channel = await interaction.guild.channels.create({
        name: `denuncia/${interaction.member.displayName}/2025`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: userId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ],
    });

    respuestas.set(userId, { canal: channel.id, paso: 0, respuestas: {} });
    await channel.send(`${interaction.user}, ${preguntas.denunciante}`);
}

export async function execute(interaction, client) {
    try {
        const selected = interaction.values[0];

        if (selected === 'denuncias') {
            await interaction.reply({ content: 'Se ha creado un canal privado para tu denuncia.', ephemeral: true });
            await manejarDenuncia(interaction);

            const messageHandler = async (message) => {
                if (message.author.bot) return;

                const userId = message.author.id;
                const denunciaData = respuestas.get(userId);

                if (!denunciaData || message.channel.id !== denunciaData.canal) return;

                const { paso, respuestas: resp } = denunciaData;
                console.log(`📌 Paso actual: ${paso}, Respuesta: ${message.content}`);

                switch (paso) {
                    case 0:
                        resp.denunciante = message.content;
                        await message.channel.send(preguntas.denunciado);
                        break;
                    case 1:
                        resp.denunciado = message.content;
                        await message.channel.send(`${preguntas.tipo}\nOpciones:\n${tiposDenuncia.map(t => t.label).join('\n')}`);
                        break;
                    case 2:
                        resp.tipo = message.content;
                        await message.channel.send(preguntas.descripcion);
                        break;
                    case 3:
                        resp.descripcion = message.content;
                        await message.channel.send(preguntas.evidencias);
                        break;
                    case 4:
                        resp.evidencias = message.content;

                        try {
                            const pdfPath = await crearPDF(resp);

                            await message.author.send({
                                content: 'Aquí está tu copia de la denuncia:',
                                files: [pdfPath]
                            }).catch(err => console.error('❌ Error al enviar MD:', err));

                            // Crear botones para "resolver" o "denegar" la denuncia
                            const row = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('resolver_denuncia')
                                    .setLabel('Resolver denuncia')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('denegar_denuncia')
                                    .setLabel('Rechazar denuncia')
                                    .setStyle(ButtonStyle.Danger)
                            );

                          // Obtener y formatear la hora actual en formato de 24 horas
                        const now = new Date();
                        const time = now.toLocaleTimeString('es-ES', { hour12: false }); // Usamos 'es-ES' para el formato español, pero puedes ajustarlo

                         //**AQUÍ VA EL CANAL DE LOGS NUEVO**
                         const extraLogsChannel = interaction.guild.channels.cache.get('1344689016091705465'); // Reemplaza con la ID del nuevo canal de logs

                         if (!extraLogsChannel) {
                             console.error('❌ No se encontró el canal de logs resumido.');
                             return;
                         }


                            // Enviar el mensaje con los botones al canal de logs
                            const logsChannel = interaction.guild.channels.cache.get('1355491058737479771'); // Reemplaza con la ID real

                            if (!logsChannel) {
                                console.error('❌ No se encontró el canal de logs.');
                                return;
                            }
                            

                        
                             // Enviar mensaje al canal de logs principal
                             const mensajeLogs = await logsChannel.send({
                                content: `‎\n[${time}] [SDOCS]  Nueva denuncia realizada por **${message.member.displayName}**.\n[15:52:08] [SDOCS]‎  Se ha generado y registrado un nuevo documento en el sistema de trámites de denuncias.\n[${time}] [SDOCS]  \`C:/SASD/Denuncias/Activas/2025/${message.member.displayName}/\`\n\`\`\`prolog\n⏳ DENUNCIA EN ESPERA\`\`\``,
                                files: [pdfPath],
                                components: [row]
                            });

                            // Enviar mensaje al canal de logs resumido
                            await extraLogsChannel.send({
                                content: `[${time}] Nueva denuncia creada.`,
                            });

                            // Manejo de los botones
                            client.on('interactionCreate', async (interaction) => {
                                if (!interaction.isButton()) return;

                                if (interaction.message.id !== mensajeLogs.id) return; // Asegura que solo interactúa con el mensaje de logs correcto.

                                if (interaction.customId === 'resolver_denuncia') {
                                  
                                    
                                    await interaction.update({
                                        content: `‎\n[${time}] [SDOCS]  El Sheriff ${interaction.user} se ha encargado de la denuncia.\n[${time}] [SDOCS]  El documento se ha archivado satisfactoriamente en la carpeta correspondiente.\n[${time}] [SDOCS]  \`C:/SASD/Denuncias/Resueltas/2025/${message.member.displayName}/\`\n\`\`\`less\n✅ DENUNCIA RESUELTA\`\`\``,
                                        components: []
                                    });

                                    // Envía mensaje al canal de logs resumido para resolución
                                    await extraLogsChannel.send({
                                        content: `[${time}] Denuncia resuelta.`,
                                    });
                                }

                                if (interaction.customId === 'denegar_denuncia') {
                                    await interaction.update({
                                        content: `‎\n[${time}] [SDOCS]  El Sheriff ${interaction.user} se ha encargado de la denuncia.\n[${time}] [SDOCS]  El documento se ha movido a la papelera de reciclaje para proceder con su eliminación.\`\`\`ml\n❌ DENUNCIA RECHAZADA\`\`\``,
                                        components: []
                                    });
                                   
                                    setTimeout(() => interaction.message.delete().catch(console.error), 20000);

                                    // Envía mensaje al canal de logs resumido para rechazo
                                    await extraLogsChannel.send({
                                        content: `[${time}] Denuncia rechazada.`,
                                    });
                                }
                            });

                            await message.channel.send('✅ Denuncia completada. Este canal se cerrará en 15 segundos.');
                            setTimeout(() => message.channel.delete().catch(console.error), 15000);
                        } catch (error) {
                            console.error('❌ Error en el proceso de denuncia:', error);
                            await message.channel.send('❌ Hubo un error al procesar la denuncia.');
                        }
                        respuestas.delete(userId);
                        break;
                }

                denunciaData.paso++;
            };

            client.on('messageCreate', messageHandler);
        } else {
            await interaction.reply({ content: 'Esta funcionalidad está en desarrollo.', ephemeral: true });
        }
    } catch (error) {
        console.error('❌ Error en el menú de selección:', error);
        await interaction.reply({ content: '❌ Hubo un error al procesar tu selección.', ephemeral: true });
    }
}