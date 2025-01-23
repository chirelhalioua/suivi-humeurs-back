const express = require('express');
const router = express.Router();
const Humeur = require('../models/Humeur'); // Modèle MongoDB des humeurs
const HumeurUser = require('../models/HumeurUser'); // Assurez-vous que vous avez ce modèle
const moment = require('moment'); // Importer moment.js

// Récupérer toutes les humeurs
router.get('/', async (req, res) => { // Modifié pour correspondre à /api/humeurs
  try {
    const humeurs = await Humeur.find(); // Cherche toutes les humeurs dans MongoDB
    res.status(200).json(humeurs); // Retourne la réponse en JSON
  } catch (err) {
    console.error('Erreur lors de la récupération des humeurs :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des humeurs.' });
  }
});

// Route POST pour enregistrer une humeur utilisateur
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
    res.status(201).json(savedHumeurUser); // Envoie la réponse avec le statut 201
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'humeur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour obtenir une humeur par son ID
router.get('/:id', async (req, res) => {  // Remarquez le paramètre :id ici
  try {
    const humeur = await Humeur.findById(req.params.id); // Cherche l'humeur par ID
    if (!humeur) {
      return res.status(404).json({ message: 'Humeur non trouvée' });
    }
    res.json(humeur); // Si l'humeur est trouvée, elle est envoyée en réponse
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
