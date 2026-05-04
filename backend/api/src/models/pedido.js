const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  usuari: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuari', required: true },
  direccio: { type: mongoose.Schema.Types.ObjectId, ref: 'Direccio' },
  estat: { type: String, enum: ['pendent', 'pagat', 'enviat', 'arribat', 'cancel·lat'], default: 'pendent' },
  total: { type: Number, required: true, min: 0 },
  stripeSessionId: { type: String },
  jocs: [{
    joc: { type: mongoose.Schema.Types.ObjectId, ref: 'Joc', required: true },
    quantitat: { type: Number, required: true, min: 1 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Pedido', PedidoSchema);
