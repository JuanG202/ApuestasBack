const mongoose = require('mongoose');

const ApuestaSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  partidoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partido',
    required: true
  },
  golesLocal: {
    type: Number,
    required: true
  },
  golesVisitante: {
    type: Number,
    required: true
  }
}, { timestamps: true }); // Opcional: añade fecha de creación y actualización

// ❌ REVISA AQUÍ: Si al final de tu archivo tenías una línea como:
// ApuestaSchema.index({ usuarioId: 1, partidoId: 1 }, { unique: true });
// ¡Asegúrate de BORRARLA por completo!

module.exports = mongoose.model('Apuesta', ApuestaSchema);