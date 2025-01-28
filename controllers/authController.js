const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Inscription d'un nouvel utilisateur
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit comporter au moins 6 caractères' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: `L'email ${email} est déjà utilisé` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    const savedUser = await user.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: savedUser });
  } catch (error) {
    console.error("Erreur lors de l'inscription : ", error);
    res.status(500).json({ message: 'Erreur du serveur lors de l\'inscription' });
  }
};

// Connexion d'un utilisateur
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

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
    const users = await User.find().select('-password');
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
    const userId = req.user.id; // L'ID de l'utilisateur est stocké dans req.user.id
    const user = await User.findById(userId).select('-password'); // Récupère l'utilisateur sans le mot de passe

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ user }); // Renvoie les informations de l'utilisateur
  } catch (error) {
    console.error('Erreur lors de la récupération du profil : ', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Mettre à jour le profil de l'utilisateur connecté
const updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mise à jour des informations
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(200).json({ message: 'Profil mis à jour', user });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil : ', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Supprimer le profil de l'utilisateur
const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Profil supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du profil : ', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Exporter les fonctions du contrôleur
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
};
