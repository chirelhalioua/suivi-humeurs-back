const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// Middleware pour vérifier le token
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Récupérer le token de l'en-tête
  
  if (!token) {
    return res.status(403).json({ message: 'Token manquant' });
  }

  try {
    // Vérifier le token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Ajouter l'utilisateur décodé à la requête
    next();  // Passer à la prochaine étape
  } catch (error) {
    console.error('Token invalide ou expiré : ', error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = authMiddleware;
