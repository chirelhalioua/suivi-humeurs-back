const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définir le schéma utilisateur
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Veuillez entrer un email valide'],
  },
  password: {
    type: String,
    required: true,
  },
});

// Ajouter un "hook" pour hasher le mot de passe avant de l'enregistrer
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // Si le mot de passe n'est pas modifié, on ne fait rien
  }

  // Hacher le mot de passe avant de l'enregistrer
  try {
    const salt = await bcrypt.genSalt(10);  // Génère un "salt" pour le hachage
    this.password = await bcrypt.hash(this.password, salt);  // Hache le mot de passe
    next();  // Passe à l'enregistrement du document
  } catch (error) {
    next(error);  // Si une erreur survient, on la transmet
  }
});

// Ajouter une méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    // Comparer le mot de passe entré avec celui enregistré dans la base de données
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Erreur lors de la comparaison des mots de passe');
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
