const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

UsuarioSchema.virtual('id').get(function() { return this._id.toHexString(); });

module.exports = mongoose.model('Usuario', UsuarioSchema);