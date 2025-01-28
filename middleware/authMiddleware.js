const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const authMiddleware = (req, res, next) => {
  // Vérification du token dans les headers de la requête (Bearer token)
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Prend le token après "Bearer "

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
  }

  try {
    // Décodage du token et ajout à `req.user` pour pouvoir l'utiliser dans les routes
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // L'ID de l'utilisateur est stocké dans `req.user.id`
    next(); // Passer à la suite du traitement
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

module.exports = authMiddleware;
