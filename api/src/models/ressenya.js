const mongoose = require('mongoose');

const RessenyaSchema = new mongoose.Schema({
  usuari: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuari', required: true },
  joc: { type: mongoose.Schema.Types.ObjectId, ref: 'Joc', required: true },
  nota: { type: Number, min: 0, max: 5, required: true },
  comentari: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Ressenya', RessenyaSchema);
