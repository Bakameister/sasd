import mongoose from 'mongoose';

const userPlateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  plateId: { type: String, required: true },
  nickname: String,
  obtainedAt: { type: Date, default: Date.now },
  assignedBy: { type: String, enum: ['registrarempleado', 'darplaca'], default: 'darplaca' },
  order: { type: Number, default: 0 }, // Campo agregado
});

userPlateSchema.index({ userId: 1, plateId: 1 }, { unique: true });

export default mongoose.model('UserPlate', userPlateSchema);