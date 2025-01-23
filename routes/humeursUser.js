const express = require('express');
const router = express.Router();
const HumeurUser = require('../models/HumeurUser');

// Définir une route pour enregistrer l'humeur
const moment = require('moment');

router.post('/humeurs_utilisateurs', async (req, res) => {
  console.log('Payload reçu :', req.body); // Log pour debug
  try {
    const { userId, date, timeOfDay, humeurId, description } = req.body;

    // Validation de la date avec moment.js
    const parsedDate = moment(date, moment.ISO_8601, true);
    if (!parsedDate.isValid()) {
      return res.status(400).json({ message: 'La date est invalide.' });
    }

    const newHumeurUser = new HumeurUser({
      userId,
      date: parsedDate.toDate(), // Convertir la date en objet Date
      timeOfDay,
      humeurId,
      description,
    });

    const savedHumeurUser = await newHumeurUser.save();
    res.status(201).json(savedHumeurUser);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'humeur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});


// Récupérer les humeurs de l'utilisateur
router.get('/humeurs_utilisateurs/:userId', async (req, res) => {
  console.log('ID utilisateur reçu :', req.params.userId); // Log pour debug
  const { userId } = req.params;

  try {
    const humeurs = await HumeurUser.find({ userId }).sort({ date: 1 });
    if (!humeurs.length) {
      return res.status(404).json({ message: 'Aucune humeur trouvée pour cet utilisateur.' });
    }
    res.json(humeurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des humeurs :', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});



module.exports = router;
