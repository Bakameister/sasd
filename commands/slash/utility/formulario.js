import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const COOLDOWN_TIME = 7 * 24 * 60 * 60 * 1000;
const cooldowns = new Map();

// Combine questions and surveys into a single flow
const formFlow = [
  { type: 'question', text: "Dirección de correo electrónico" },
  { type: 'question', text: "Horas Jugadas en Total (IC)" },
  {
    type: 'survey',
    text: "¿Cuenta con un buen micrófono sin interferencias ni eco?",
    options: [
      { text: "Sí" },
      { text: "No" }
      
    ]
  },
  {
    type: 'survey',
    text: "¿Cuánto tiempo tienes disponible para patrullar diariamente?",
    options: [
      { text: "Menos de dos horas diarias" },
      { text: "Entre dos y cuatro horas diarias" },
      { text: "Entre cuatro y seis horas diarias" },
      { text: "Mas de seis horas diarias" }
    ]
  },
  {
    type: 'survey',
    text: "¿Cuánto tiempo tienes disponible para patrullar diariamente?",
    options: [
      { text: "Sí" },
      { text: "No" }
      
    ]
  },
  { type: 'question', text: "¿Por qué quieres unirte a SASD?" },
  {
    type: 'survey',
    text: "¿En que dispositivo juegas?",
    options: [
      { emoji: "💻", text: "PC / Laptop" },
      { emoji: "📱", text: "Móvil" }
    ]
  },
  { type: 'question', text: "¿Tienes experiencia previa en roleplay?" },
  {
    type: 'survey',
    text: "¿Cuántas horas a la semana podrías dedicar al roleplay?",
    options: [
      { text: "1-5 horas" },
      { text: "6-10 horas" },
      { text: "11-20 horas" },
      { text: "Más de 20 horas" }
    ]
  },
  { type: 'question', text: "¿Has leído las normas del servidor?" },
  { type: 'question', text: "¿Qué tipo de personaje te gustaría interpretar?" }
];

const terms = [
  "1.  Me comprometo a no portar ni utilizar objetos ilegales, armas no autorizadas, drogas u otros artículos prohibidos durante mi servicio en el Sheriff Department. En caso de ser sorprendido con artículos ilegales, me someteré a las sanciones correspondientes, incluyendo, pero no limitándose a, la expulsión del Departamento y posibles consecuencias legales.",
  "2.  Acepto y consiento que, antes de ingresar a la academia y durante mi servicio, mis vehículos y materiales personales pueden ser requisados en cualquier momento si se sospecha que contienen objetos ilegales o no permitidos según las leyes del Departamento. En caso de encontrar materiales prohibidos, las autoridades procederán conforme a las regulaciones del Sheriff Department.",
  "3.  Acepto que durante mi servicio en el Sheriff Department solo puedo participar en actividades legales y permitidas, tales como trabajar como mecánico, abogado o en empresas de reparto. Queda estrictamente prohibido participar en trabajos ilegales, como el tráfico de drogas, contrabando o cualquier otro tipo de actividad delictiva.",
  "4.  Me comprometo a seguir todas las normativas, protocolos y órdenes de mis superiores durante mi servicio. El incumplimiento de las reglas internas del Sheriff Department, o el comportamiento despectivo hacia superiores o compañeros, puede resultar en sanciones que incluyen amonestaciones, suspensión o expulsión definitiva."


];

const activeUsers = new Set();

export const data = new SlashCommandBuilder()
  .setName('formulario')
  .setDescription('Inicia el proceso de formulario de ingreso');

  export async function execute(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true });

        // Verificar si las postulaciones están abiertas
        if (!global.postulacionesAbiertas) {
            return await interaction.editReply({
                content: 'Las postulaciones están cerradas. Por favor, espera a que se abran nuevamente.',
                ephemeral: true
            });
        }
    
    const lastSubmission = cooldowns.get(interaction.user.id);
    if (lastSubmission) {
      const timeLeft = COOLDOWN_TIME - (Date.now() - lastSubmission);
      if (timeLeft > 0) {
        const days = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
        return await interaction.editReply({
          content: `Debes esperar ${days} día(s) antes de poder enviar otro formulario.`,
          ephemeral: true
        });
      }
    }
    
    if (activeUsers.has(interaction.user.id)) {
      return await interaction.editReply({
        content: 'Ya tienes un formulario activo. Por favor, complétalo o espera a que expire.',
        ephemeral: true
      });
    }
    
    activeUsers.add(interaction.user.id);
    
    const channel = await interaction.guild.channels.create({
      name: `formulario-${interaction.user.username}`,
      type: 0,
      parent: process.env.FORMS_CATEGORY_ID,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.client.user.id,
          allow: [PermissionFlagsBits.ViewChannel],
        }
      ]
    });

    await interaction.editReply({
      content: `Tu formulario ha sido creado en ${channel}. Tienes 30 minutos para completarlo.`,
      ephemeral: true
    });

    const answers = new Map();
    let currentIndex = 0;
    let lastQuestionMessage = null;
    let currentTermIndex = 0;
    const acceptedTerms = new Set();

    await channel.send({ content: `‎` });
    
    await channel.send({
      content: `<@${interaction.user.id}> bienvenid@ a nuestro **formulario de perfil de candidato**, en el que se incluirán tanto tus expectativas como tus habilidades, virtudes y metas.\n Antes de comenzar el formulario debes aceptar los términos y condiciones, que facilitarán el proceso de selección y por el que podrás ser destituido si los incumples posteriormente.`
    });

    async function showNextTerm() {
      if (currentTermIndex >= terms.length) {
        await sendNextItem();
        return;
      }

      const termRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`accept_term_${currentTermIndex}`)
            .setLabel('Acepto')
            .setStyle(ButtonStyle.Success)
        );
      
      await channel.send({
        content: `‎ \n**\`‎ TÉRMINOS Y CONDICIONES‎ \`\n**‎ ${terms[currentTermIndex]}\n‎ `,
        components: [termRow]
      });
    }

    async function sendNextItem() {
      if (lastQuestionMessage) {
        await lastQuestionMessage.delete().catch(() => {});
      }

      if (currentIndex >= formFlow.length) {
        await showReview();
        return;
      }

      const currentItem = formFlow[currentIndex];
      
      if (currentItem.type === 'question') {
        const questionEmbed = new EmbedBuilder()
          .setColor('#2B2D31')
          .setDescription(currentItem.text)
          .setFooter({ text: `Pregunta ${currentIndex + 1} de ${formFlow.length}` });

        lastQuestionMessage = await channel.send({
          content: `‎ \n`,
          embeds: [questionEmbed]
        });
      } else if (currentItem.type === 'survey') {
        const surveyEmbed = new EmbedBuilder()
          .setColor('#2B2D31')
          .setTitle(currentItem.text)
          .setDescription('Selecciona una de las siguientes opciones:')
          .setFooter({ text: `Pregunta ${currentIndex + 1} de ${formFlow.length}` });

        const rows = [];
        let currentRow = new ActionRowBuilder();
        let buttonCount = 0;

        for (const option of currentItem.options) {
          const button = new ButtonBuilder()
            .setCustomId(`survey_${currentIndex}_${buttonCount}`)
            .setLabel(option.text)
            .setEmoji(option.emoji)
            .setStyle(ButtonStyle.Secondary);

          currentRow.addComponents(button);
          buttonCount++;

          // Discord allows max 5 buttons per row
          if (buttonCount % 5 === 0 || buttonCount === currentItem.options.length) {
            rows.push(currentRow);
            currentRow = new ActionRowBuilder();
          }
        }

        lastQuestionMessage = await channel.send({
          embeds: [surveyEmbed],
          components: rows
        });

        try {
          const response = await lastQuestionMessage.awaitMessageComponent({
            filter: i => i.user.id === interaction.user.id && i.customId.startsWith(`survey_${currentIndex}`),
            time: 300000
          });

          const selectedIndex = parseInt(response.customId.split('_')[2]);
          const selectedOption = currentItem.options[selectedIndex];
          answers.set(currentItem.text, `${selectedOption.emoji} ${selectedOption.text}`);
          await response.update({ components: [] });
          currentIndex++;
          await sendNextItem();
        } catch (error) {
          console.error('Error collecting button interaction:', error);
        }
      }
    }

    await showNextTerm();

    const termButtonCollector = channel.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id && i.customId.startsWith('accept_term_'),
      time: 1800000
    });

    termButtonCollector.on('collect', async (i) => {
      const termIndex = parseInt(i.customId.split('_')[2]);
      acceptedTerms.add(termIndex);
      await i.update({ components: [] });
      
      currentTermIndex++;
      if (currentTermIndex < terms.length) {
        await showNextTerm();
      } else {
        termButtonCollector.stop();
        await channel.send('‎ \n`✅ Has aceptado todos los términos. Comenzando con el formulario...`\n');
        await sendNextItem();
      }
    });

    const messageCollector = channel.createMessageCollector({
      filter: m => m.author.id === interaction.user.id,
      time: 1800000
    });

    messageCollector.on('collect', async (message) => {
      if (acceptedTerms.size === terms.length && formFlow[currentIndex]?.type === 'question') {
        await message.delete().catch(() => {});
        answers.set(formFlow[currentIndex].text, message.content);
        currentIndex++;
        await sendNextItem();
      }
    });

    messageCollector.on('end', async (collected, reason) => {
      if (reason !== 'completed') {
        await channel.send('⏰ Se agotó el tiempo para completar el formulario. El canal se eliminará en 10 segundos.');
        setTimeout(() => channel.delete(), 10000);
      }
    });

    async function showReview() {
      const reviewFields = Array.from(answers.entries()).map(([question, answer]) => ({
        name: question,
        value: answer || 'Sin respuesta'
      }));

      const reviewEmbed = new EmbedBuilder()
        .setColor('#2B2D31')
        .setDescription('Revisa tus respuestas antes de enviar el formulario.\nPara editar una respuesta, reacciona con el número correspondiente.\n‎ ')
        .addFields(reviewFields);

      const confirmRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('confirm_form')
            .setLabel('Enviar formulario')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('cancel_form')
            .setLabel('Cancelar formulario')
            .setStyle(ButtonStyle.Danger)
        );

      const reviewMsg = await channel.send({
        embeds: [reviewEmbed],
        components: [confirmRow]
      });

      const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
      const answersArray = Array.from(answers.entries());
      
      for (let i = 0; i < Math.min(answersArray.length, numbers.length); i++) {
        await reviewMsg.react(numbers[i]);
      }

      const reactionFilter = (reaction, user) => 
        numbers.includes(reaction.emoji.name) && user.id === interaction.user.id;

      const reactionCollector = reviewMsg.createReactionCollector({
        filter: reactionFilter,
        time: 300000
      });

      reactionCollector.on('collect', async (reaction, user) => {
        const index = numbers.indexOf(reaction.emoji.name);
        if (index !== -1 && index < answersArray.length) {
          const [question, _] = answersArray[index];
          const currentItem = formFlow.find(item => item.text === question);

          if (currentItem.type === 'question') {
            const editMsg = await channel.send({
              content: `Por favor, escribe tu nueva respuesta para la pregunta: **${question}**`
            });

            const editFilter = m => m.author.id === user.id;
            const editCollector = channel.createMessageCollector({
              filter: editFilter,
              max: 1,
              time: 60000
            });

            editCollector.on('collect', async (message) => {
              answers.set(question, message.content);
              await message.delete();
              await editMsg.delete();

              const updatedFields = Array.from(answers.entries()).map(([q, a]) => ({
                name: q,
                value: a || 'Sin respuesta'
              }));

              const updatedEmbed = EmbedBuilder.from(reviewMsg.embeds[0])
                .setFields(updatedFields);

              await reviewMsg.edit({ embeds: [updatedEmbed] });
            });
          } else if (currentItem.type === 'survey') {
            const surveyEmbed = new EmbedBuilder()
              .setColor('#2B2D31')
              .setTitle(question)
              .setDescription(
                currentItem.options
                  .map((option) => `${option.emoji} ${option.text}`)
                  .join('\n')
              )
              .setFooter({ text: 'Reacciona con el emoji correspondiente para cambiar tu respuesta' });

            const editMsg = await channel.send({ embeds: [surveyEmbed] });

            for (const option of currentItem.options) {
              await editMsg.react(option.emoji);
            }

            const surveyFilter = (r, u) => {
              return currentItem.options.some(option => option.emoji === r.emoji.name) && 
                     u.id === interaction.user.id;
            };

            const surveyCollector = editMsg.createReactionCollector({
              filter: surveyFilter,
              max: 1,
              time: 60000
            });

            surveyCollector.on('collect', async (r) => {
              const selectedOption = currentItem.options.find(option => option.emoji === r.emoji.name);
              answers.set(question, selectedOption.text);
              await editMsg.delete();

              const updatedFields = Array.from(answers.entries()).map(([q, a]) => ({
                name: q,
                value: a || 'Sin respuesta'
              }));

              const updatedEmbed = EmbedBuilder.from(reviewMsg.embeds[0])
                .setFields(updatedFields);

              await reviewMsg.edit({ embeds: [updatedEmbed] });
            });
          }
        }
        await reaction.users.remove(user.id);
      });

      const buttonFilter = i => i.user.id === interaction.user.id;
      const buttonCollector = channel.createMessageComponentCollector({
        filter: buttonFilter,
        time: 300000
      });

      buttonCollector.on('collect', async (i) => {
        if (i.customId === 'confirm_form') {
          await generateAndSendPDF();
          buttonCollector.stop();
          reactionCollector.stop();
        } else if (i.customId === 'cancel_form') {
          await channel.send('Formulario cancelado. El canal se cerrará en 5 segundos.');
          setTimeout(() => channel.delete(), 5000);
          buttonCollector.stop();
          reactionCollector.stop();
        }
      });
    }

    async function generateAndSendPDF() {
      const doc = new PDFDocument();
      const pdfPath = path.join(process.cwd(), 'temp', `formulario-${interaction.user.id}.pdf`);
      
      if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
        fs.mkdirSync(path.join(process.cwd(), 'temp'));
      }

      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      doc.fontSize(20).text('Formulario de Ingreso SASD', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12);

      // Write all answers in order
      for (const [question, answer] of answers) {
        doc.font('Helvetica-Bold').text(question);
        doc.font('Helvetica').text(answer);
        doc.moveDown();
      }

      doc.moveDown();
      doc.font('Helvetica-Bold').text('Términos y Condiciones Aceptados:', { underline: true });
      doc.moveDown();
      
      terms.forEach((term) => {
        doc.rect(50, doc.y, 10, 10).stroke();
        doc.moveTo(52, doc.y + 5)
           .lineTo(55, doc.y + 8)
           .lineTo(58, doc.y + 2)
           .stroke();
        
        doc.text(term, 70, doc.y - 10);
        doc.moveDown();
      });

      doc.end();

      await new Promise(resolve => writeStream.on('finish', resolve));

      cooldowns.set(interaction.user.id, Date.now());

      await interaction.user.send({
        content: 'Aquí tienes una copia de tu formulario:',
        files: [pdfPath]
      });

      const adminChannel = interaction.guild.channels.cache.get(process.env.ADMIN_CHANNEL_ID);
      if (adminChannel) {
        const formEmbed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('📝 Nueva Solicitud')
          .setDescription(`Solicitud de ${interaction.user.tag}`)
          .addFields(
            Array.from(answers.entries()).map(([question, answer]) => ({
              name: question,
              value: answer || 'Sin respuesta'
            }))
          )
          .setTimestamp()
          .setFooter({ text: 'Estado: En revisión' });

        const reviewButtons = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`accept_form_${interaction.user.id}`)
              .setLabel('✅ Aceptar')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`reject_form_${interaction.user.id}`)
              .setLabel('❌ Rechazar')
              .setStyle(ButtonStyle.Danger)
          );

        await adminChannel.send({
          embeds: [formEmbed],
          components: [reviewButtons],
          files: [pdfPath]
        });
      }

      await channel.send('✅ Formulario enviado correctamente. Este canal se cerrará en 5 segundos.');
      setTimeout(() => {
        fs.unlinkSync(pdfPath);
        channel.delete();
      }, 5000);
    }

  } catch (error) {
    console.error('Error en el comando formulario:', error);
    activeUsers.delete(interaction.user.id);
    await interaction.editReply({
      content: '❌ Hubo un error al crear el formulario. Por favor, inténtalo de nuevo más tarde.',
      ephemeral: true
    });
  }
}

export default execute;