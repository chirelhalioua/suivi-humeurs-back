const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Récupère le token dans le header Authorization

    if (!token) {
        return res.status(403).json({ message: 'Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token
        req.userId = decoded.id; // Ajoute l'ID de l'utilisateur dans la requête
        next(); // Continue la requête
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};

module.exports = authMiddleware;
