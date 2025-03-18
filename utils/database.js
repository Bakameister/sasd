import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

export async function connectToDatabase() {
  try {
    console.log('🔄 Conectando a la base de datos MongoDB...');

    // Verificar si la URI de MongoDB está definida
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI no está definida en el archivo .env');
      console.warn('⚠️ Las funcionalidades de base de datos estarán desactivadas');
      return false;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conexión a MongoDB establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    console.warn('⚠️ Las funcionalidades de base de datos estarán desactivadas');
    return false;
  }
}

// Función para generar un ID único para cada usuario
export async function generateUniqueUserId() {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ No hay conexión a MongoDB, generando ID aleatorio');
      return Math.floor(1 + Math.random() * 100);
    }

    const User = mongoose.models.User || (await import('../models/user.js')).User;

    const lastUser = await User.findOne().sort({ userId: -1 });

    return lastUser ? lastUser.userId + 1 : 1;
  } catch (error) {
    console.error('❌ Error al generar ID único:', error);
    return Math.floor(1 + Math.random() * 100);
  }
}

// Importar modelo de Placa dinámicamente
let Placa;
(async () => {
  try {
    const module = await import('../models/Plate.js');
    Placa = module.Placa;
  } catch (error) {
    console.error('❌ Error al importar el modelo Placa:', error);
  }
})();

// Función para guardar una placa en la base de datos
export async function guardarPlaca(userId, placa) {
  try {
    if (!Placa) {
      console.warn('⚠️ El modelo Placa no está cargado');
      return false;
    }

    const nuevaPlaca = new Placa({ userId, placa });
    await nuevaPlaca.save();
    console.log(`✅ Placa ${placa} guardada correctamente para el usuario ${userId}`);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar la placa:', error);
    return false;
  }
}

// Función para formatear nombres
export function formatName(name) {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Función para validar que un texto solo contenga letras
export function containsOnlyLetters(text) {
  return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(text);
}