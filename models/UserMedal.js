import mongoose from 'mongoose';

const userMedalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  medalId: {
    type: String,
    required: true
  },
  obtainedAt: {
    type: Date,
    default: Date.now
  },
  nickname: String, // Agrega el campo nickname
  obtainedAt: {
    type: Date,
    default: Date.now,
  }
});

userMedalSchema.index({ userId: 1, medalId: 1 }, { unique: true });

export default mongoose.model('UserMedal', userMedalSchema);