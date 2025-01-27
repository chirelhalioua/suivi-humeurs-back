const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");

// Importation des routes
const humeursRoutes = require("./routes/humeursRoutes");
const authRoutes = require("./routes/authRoutes");
const humeursUserRoute = require("./routes/humeursUser");

// Charger les variables d'environnement
dotenv.config();

// Vérifier que MONGO_URI est défini
if (!process.env.MONGODB_URI) {
  console.error("Erreur : la variable d'environnement MONGO_URI n'est pas définie.");
  process.exit(1); // Arrête le serveur si MONGODB_URI n'est pas défini
}

// Initialisation de l'application Express
const app = express();

// Configuration CORS
app.use(cors({ origin: "*" })); 

// Middleware
app.use(express.json()); // Pour analyser les requêtes en JSON
app.use(express.urlencoded({ extended: true })); // Pour analyser les requêtes URL-encoded

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connexion à MongoDB réussie");
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB :", err);
    process.exit(1); // Arrête le serveur en cas d'erreur
  });

// Définition des routes
app.use("/api/auth", authRoutes);
app.use("/api", humeursUserRoute);
app.use("/api/humeurs", humeursRoutes);

// Afficher toutes les routes disponibles
console.log("Routes disponibles :");
console.log(listEndpoints(app));

// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur." });
});

// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
