const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, getUserProfile, deleteUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Importer le middleware
const User = require('../models/User'); // Importer le modèle utilisateur

// Inscription
router.post('/register', (req, res) => {
  console.log('Requête reçue sur /register');
  registerUser(req, res);  // Appelle la fonction pour l'inscription
});


// Connexion
router.post('/login', loginUser); // Corrigé pour éviter un double /api

// Profil de l'utilisateur (protégé par le middleware)
router.get('/profile', authMiddleware, getUserProfile); // Utiliser le middleware pour vérifier le token

// Récupérer tous les utilisateurs
router.get('/users', getAllUsers);

// Route pour supprimer le profil de l'utilisateur connecté
router.delete('/profile', authMiddleware, deleteUserProfile);

// Endpoint pour récupérer les données utilisateur connecté
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Récupère l'utilisateur depuis req.user
    if (!user) return res.status(404).send('Utilisateur non trouvé.');
    res.json(user);
  } catch (error) {
    res.status(500).send('Erreur serveur.');
  }
});

module.exports = router;
