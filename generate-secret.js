const crypto = require('crypto');

// Générer une clé secrète aléatoire
const secretKey = crypto.randomBytes(64).toString('hex');

// Afficher la clé générée dans la console
console.log(secretKey);
