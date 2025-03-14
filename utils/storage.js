import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storagePath = path.join(__dirname, '../data/state.json');

export async function initializeStorage() {
  try {
    // Asegurar que el directorio data existe
    await fs.mkdir(path.dirname(storagePath), { recursive: true });
    
    // Verificar si el archivo existe
    try {
      await fs.access(storagePath);
    } catch {
      // Si no existe, crear con estado inicial
      await fs.writeFile(storagePath, JSON.stringify({
        postulacionesAbiertas: false,
        mensajeEstadoPostulacionesId: null,
        mensajeEstadoChannelId: null
      }, null, 2));
    }
  } catch (error) {
    console.error('❌ Error al inicializar el almacenamiento:', error);
  }
}

export async function loadState() {
  try {
    const data = await fs.readFile(storagePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error al cargar el estado:', error);
    return {
      postulacionesAbiertas: false,
      mensajeEstadoPostulacionesId: null,
      mensajeEstadoChannelId: null
    };
  }
}

export async function saveState(state) {
  try {
    await fs.writeFile(storagePath, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('❌ Error al guardar el estado:', error);
  }
}