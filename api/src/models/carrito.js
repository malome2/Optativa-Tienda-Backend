const mongoose = require('mongoose');

const CarritoSchema = new mongoose.Schema({
  usuari: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuari', required: true },
  jocs: [{
    joc: { type: mongoose.Schema.Types.ObjectId, ref: 'Joc', required: true },
    quantitat: { type: Number, required: true, min: 1 }
  }]
});

module.exports = mongoose.model('Carrito', CarritoSchema);
