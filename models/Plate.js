import mongoose from 'mongoose';

const plateSchema = new mongoose.Schema({
    plateId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
        // Puedes agregar una validación adicional si deseas, pero no es estrictamente necesario
        // ya que ahora esperamos rutas relativas.
    },
    roleId: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Plate', plateSchema);