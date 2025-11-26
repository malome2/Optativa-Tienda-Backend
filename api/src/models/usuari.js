const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuariSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  contrasenya: { type: String, required: true, minlength: 6 },
  rol: { type: String, enum: ['client', 'admin'], default: 'client' },
  telefon: { type: String },
  direccions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Direccio' }],
  refreshTokens: [
    {
      token: { type: String},
      ceatedAt: { type: Date,  default: Date.now}
    }
  ]
}, { timestamps: true });

// HASH de la contrasenya
UsuariSchema.pre('save', async function (next) {
  if (!this.isModified('contrasenya')) return next();

  const salt = await bcrypt.genSalt(10);
  this.contrasenya = await bcrypt.hash(this.contrasenya, salt);
  next();
});

// Método para comparar contrasenya
UsuariSchema.methods.compararContrasenya = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.contrasenya);
};

module.exports = mongoose.model('Usuari', UsuariSchema);
