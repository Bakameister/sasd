import { ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { saveState } from '../../../utils/storage.js';

export const data = {
  name: 'sasd',
  description: 'Crea mensaje en el canal de normativas IC/OCC',
};

export async function execute(message) {
  try {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('sasd1')
        .setLabel('📑 Interpretación de rol')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('sasd2')
        .setLabel('📑 Ingreso a la facción')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('sasd3')
        .setLabel('📑 Nuestra academia')
        .setStyle(ButtonStyle.Secondary)
    );

    const reglasImage = new AttachmentBuilder('./images/header_sasd.png');
    const reglasImage2 = new AttachmentBuilder('./images/header_sasd2.png');

    const statusEmbed = new EmbedBuilder()
      .setColor(global.postulacionesAbiertas ? '#00ff00' : '#ff0000')
      .setDescription(global.postulacionesAbiertas
        ? `\`\`\`less\nPOSTULACIONES ABIERTAS\n\`\`\`\n`
        : `\`\`\`ml\nPOSTULACIONES CERRADAS\n\`\`\`\n`);

    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ files: [reglasImage] });
    await message.channel.send({ files: [reglasImage2] });
    await message.channel.send({ components: [row] });
    await message.channel.send({ content: '⠀⠀⠀⠀⠀⠀⠀⠀\n' });
    await message.channel.send({ content: '> Antes de comenzar el proceso de postulación, es importante que entiendas los pasos que forman parte de nuestra selección. El camino para ingresar al SASD no es sencillo, pero es una excelente oportunidad para demostrar tu compromiso y habilidades. Te explicamos brevemente cómo funciona el proceso:\n\n**\`‎1. POSTULACIÓN INICIAL‎ \`‎ ‎ <:placa2:1349789910860693575>\n**Para iniciar tu proceso de admisión a la academia del SASD, te pedimos que completes un formulario con tus datos y respondas algunas preguntas clave que nos ayudarán a conocer tu experiencia, motivación y aptitudes. Esto nos permitirá descartar postulantes rápidamente.\n\n**\`‎2. REVISIÓN DE POSTULACIONES‎ \`‎ ‎ <:placa2:1349789910860693575>\n**Nuestro equipo revisará cuidadosamente tu solicitud. Los postulantes seleccionados para continuar el proceso serán convocados para ingresar al discord de la academia del SASD (Biscailuz Center Academy Training) y recibirán instrucciones lo antes posible.\n\n**\`‎3. PERIODO EN LA ACADEMIA‎ \`‎ ‎ <:placa2:1349789910860693575>\n**Una vez aceptado, pasarás a la Academia, donde recibirás formación en diversas áreas esenciales, como patrullaje, protocolos de seguridad, códigos de radio, y habilidades de trabajo en equipo. Durante este periodo, evaluaremos tu desempeño y tu capacidad para adaptarte a las exigencias del cuerpo.\n\n**\`‎4. EVALUACIÓN FINAL Y SELECCIÓN‎ \`‎ ‎ <:placa2:1349789910860693575>\n**Al finalizar la academia, aquellos que demuestren un alto nivel de compromiso, habilidades y aptitudes necesarias serán elegidos para formar parte oficial del SASD.\n\n> Es importante que sepas que el proceso es competitivo y solo los mejores serán seleccionados para formar parte de nuestra unidad. Si estás listo para asumir el desafío, te invitamos a completar el formulario de postulación. Utiliza el comando `/formulario`\n‎ ' });
    const statusMsg = await message.channel.send({ embeds: [statusEmbed] });

    // Guardar el ID del mensaje y del canal para futuras actualizaciones
    global.mensajeEstadoPostulacionesId = statusMsg.id;
    global.mensajeEstadoChannelId = message.channel.id;

    // Guardar el estado actualizado
    await saveState({
      postulacionesAbiertas: global.postulacionesAbiertas,
      mensajeEstadoPostulacionesId: global.mensajeEstadoPostulacionesId,
      mensajeEstadoChannelId: global.mensajeEstadoChannelId
    });

    await message.delete();
  } catch (error) {
    console.error('Error al ejecutar el comando:', error);
    await message.reply('❌ Hubo un error al enviar las reglas.');
  }
}