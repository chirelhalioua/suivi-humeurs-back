const Humeur = require('../models/Humeur');

exports.getAllHumeurs = async (req, res) => {
  try {
    const humeurs = await Humeur.find();
    res.status(200).json(humeurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des humeurs.' });
  }
};
