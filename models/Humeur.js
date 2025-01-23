const mongoose = require('mongoose');

const HumeurSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  image: { type: String, required: true },
  film: { type: String, required: true }, // Nouveau champ
});

module.exports = mongoose.model('Humeur', HumeurSchema);
