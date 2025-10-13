const mongoose = require('mongoose');

const UsuariSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  contrasenya: { type: String, required: true, minlength: 6 },
  rol: { type: String, enum: ['client', 'admin'], default: 'client' },
  telefon: { type: String },
  direccions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Direccio' }]
});

module.exports = mongoose.model('Usuari', UsuariSchema);
