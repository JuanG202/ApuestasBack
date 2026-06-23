const mongoose = require('mongoose');

const ApuestaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  partidoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partido', required: true },
  golesLocal: { type: Number, required: true },
  golesVisitante: { type: Number, required: true }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Asegura que un usuario solo tenga una apuesta por partido
ApuestaSchema.index({ usuarioId: 1, partidoId: 1 }, { unique: true });
ApuestaSchema.virtual('id').get(function() { return this._id.toHexString(); });

module.exports = mongoose.model('Apuesta', ApuestaSchema);