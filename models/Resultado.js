const mongoose = require('mongoose');

const ResultadoSchema = new mongoose.Schema({
  partidoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partido', required: true, unique: true },
  golesLocal: { type: Number, required: true },
  golesVisitante: { type: Number, required: true }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

ResultadoSchema.virtual('id').get(function() { return this._id.toHexString(); });

module.exports = mongoose.model('Resultado', ResultadoSchema);