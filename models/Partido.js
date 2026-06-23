const mongoose = require('mongoose');

const PartidoSchema = new mongoose.Schema({
  fecha: { type: String, required: true }, // Guardado como 'YYYY-MM-DD'
  local: { type: String, required: true },
  visitante: { type: String, required: true }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

PartidoSchema.virtual('id').get(function() { return this._id.toHexString(); });

module.exports = mongoose.model('Partido', PartidoSchema);