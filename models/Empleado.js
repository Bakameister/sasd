import mongoose from 'mongoose';

const empleadoSchema = new mongoose.Schema({
  empleadoId: { type: Number, unique: true },
  nombre: String,
  apellido: String,
  nickname: String, // Agrega el campo nickname
  rolId: String,
  placaId: String,
});

export default mongoose.model('Empleado', empleadoSchema);
