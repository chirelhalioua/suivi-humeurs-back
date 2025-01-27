const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Inscription d'un nouvel utilisateur
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Vérification du format de l'email
  if (typeof email !== 'string' || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  // Vérification de la complexité du mot de passe
  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit comporter au moins 6 caractères' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: `L'email ${email} est déjà utilisé` });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Mot de passe haché : ${hashedPassword}`);

    // Créer un nouvel utilisateur
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Sauvegarder l'utilisateur dans la base de données
    try {
      const savedUser = await user.save();
      console.log("Utilisateur ajouté avec succès :", savedUser);

      // Créer un token JWT
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Réponse avec le token et les informations de l'utilisateur
      res.status(201).json({ token, user: savedUser });

    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur : ", error);
      return res.status(500).json({ message: 'Erreur du serveur lors de l\'ajout de l\'utilisateur' });
    }

  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Connexion
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Valider que l'email est bien une chaîne de caractères
  if (typeof email !== 'string') {
    return res.status(400).json({ message: 'L\'email doit être une chaîne de caractères' });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe est invalide ou trop court' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Comparer le mot de passe avec celui haché dans la base de données
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Erreur lors de la connexion : ', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        // Récupérer tous les utilisateurs sans les mots de passe
        const users = await User.find().select('-password'); // Exclut le champ "password"
        console.log("Utilisateurs récupérés :", users);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
        }
        res.status(200).json({ users });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs : ', error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

// Récupérer le profil de l'utilisateur connecté
const getUserProfile = async (req, res) => {
  try {
      // L'utilisateur connecté est dans `req.user` grâce au middleware
      const userId = req.user.id; // Utiliser `req.user.id` si c'est ainsi que le token est décodé

      // Trouver l'utilisateur en utilisant son ID
      const user = await User.findById(userId).select('-password'); // Exclure le mot de passe

      if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Retourner les informations de l'utilisateur
      res.status(200).json({ user });
  } catch (error) {
      console.error('Erreur lors de la récupération du profil : ', error);
      res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Supprimer le profil
const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Récupérer l'ID utilisateur depuis le middleware authMiddleware
    const user = await User.findByIdAndDelete(userId); // Supprimer l'utilisateur

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ message: 'Profil supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du profil:', error);
    res.status(500).json({ error: 'Erreur serveur. Impossible de supprimer le profil.' });
  }
};

// Exporter toutes les fonctions nécessaires
module.exports = { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserProfile,
  deleteUserProfile
};
