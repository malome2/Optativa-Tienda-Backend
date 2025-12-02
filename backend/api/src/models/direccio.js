const mongoose = require('mongoose');

const DireccioSchema = new mongoose.Schema({
  pais: { type: String, required: true },
  carrer: { type: String, required: true },
  pis: { type: String },
  codiPostal: { type: String, required: true },
  usuari: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuari', required: true }
});

module.exports = mongoose.model('Direccio', DireccioSchema);
