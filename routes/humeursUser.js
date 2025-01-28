const express = require('express');
const router = express.Router();
const HumeurUser = require('../models/HumeurUser');
const moment = require('moment');
const authMiddleware = require('../middleware/authMiddleware'); // Import du middleware d'authentification

// Route pour enregistrer l'humeur
router.post('/humeurs_utilisateurs', authMiddleware, async (req, res) => {
    console.log('Payload reçu :', req.body); // Log pour debug
    try {
        const { date, timeOfDay, humeurId, description } = req.body;

        // Validation de la date avec moment.js
        const parsedDate = moment(date, moment.ISO_8601, true);
        if (!parsedDate.isValid()) {
            return res.status(400).json({ message: 'La date est invalide.' });
        }

        // L'ID de l'utilisateur est extrait du token JWT
        const userId = req.userId;

        const newHumeurUser = new HumeurUser({
            userId,  // Utilise l'ID de l'utilisateur authentifié
            date: parsedDate.toDate(),  // Convertir la date en objet Date
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

// Route pour récupérer les humeurs de l'utilisateur authentifié
router.get('/humeurs_utilisateurs', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;  // Utilise l'ID de l'utilisateur authentifié depuis le middleware

        // Récupérer les humeurs de l'utilisateur authentifié
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
