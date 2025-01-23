const mongoose = require('mongoose');
const Humeur = require('./models/Humeur'); // Assurez-vous que le modèle est bien importé

// Connectez-vous à MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connexion à MongoDB réussie');
  
  // Récupérer toutes les humeurs existantes avec leur ID incorrect
  const humeurs = await Humeur.find();

  // Mettre à jour l'ID pour chaque humeur
  for (const humeur of humeurs) {
    const objectId = new mongoose.Types.ObjectId(); // Créer un nouvel ObjectId valide
    
    // Mettre à jour l'ID de chaque humeur
    await Humeur.updateOne(
      { _id: humeur._id }, // Trouver la humeur avec l'ID actuel
      { $set: { _id: objectId } } // Mettre à jour l'ID avec un ObjectId valide
    );

    console.log(`Mis à jour l'humeur avec ID : ${humeur._id} => ${objectId}`);
  }

  // Terminer la connexion à MongoDB
  mongoose.disconnect();
}).catch((error) => {
  console.error('Erreur lors de la connexion à MongoDB', error);
});
