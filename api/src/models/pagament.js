const mongoose = require('mongoose');

const PagamentSchema = new mongoose.Schema({
  metode: { type: String, enum: ['targeta', 'paypal', 'transferencia'], required: true },
  pedido: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true }
});

module.exports = mongoose.model('Pagament', PagamentSchema);
