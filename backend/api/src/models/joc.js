const mongoose = require('mongoose');

const JocSchema = new mongoose.Schema({
  titol: { type: String, required: true },
  descripcio: { type: String },
  preu: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  categoria: { type: String, required: true }
});

module.exports = mongoose.model('Joc', JocSchema);
