import mongoose from 'mongoose';

const inventarioSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  placas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Placa' }]
});

export const Inventario = mongoose.model('Inventario', inventarioSchema);