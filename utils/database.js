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
    // Verificar si la conexión a MongoDB está activa
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ No hay conexión a MongoDB, generando ID aleatorio');
      return Math.floor(1 + Math.random() * 100);
    }
    
    // Importar el modelo de usuario
    const User = mongoose.models.User;
    
    // Encontrar el último ID asignado
    const lastUser = await User.findOne().sort({ userId: -1 });
    
    // Si no hay usuarios, comenzar desde 1
    // Si hay usuarios, incrementar el último ID en 1
    return lastUser ? lastUser.userId + 1 : 1;
  } catch (error) {
    console.error('❌ Error al generar ID único:', error);
    return Math.floor(1 + Math.random() * 100); // Fallback a un número aleatorio
  }
}

// Función para formatear nombres (primera letra mayúscula, resto minúscula)
export function formatName(name) {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Función para validar que un texto solo contenga letras
export function containsOnlyLetters(text) {
  return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(text);
}