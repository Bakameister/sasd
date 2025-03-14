export const data = {
  name: 'ping',
  description: 'Responde con la latencia del bot',
};

export async function execute(message) {
  try {
    const sent = await message.reply('Calculando ping...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    
    await sent.edit(`🏓 Pong! Latencia: ${latency}ms | API Latency: ${Math.round(message.client.ws.ping)}ms`);
  } catch (error) {
    console.error('Error al ejecutar el comando ping:', error);
    await message.reply('❌ Hubo un error al calcular el ping.');
  }
}