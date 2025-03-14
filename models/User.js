import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  level: {
    type: Number,
    default: 1
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);