const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const listEndpoints = require("express-list-endpoints");

// Importation des routes
const humeursRoutes = require("./routes/humeursRoutes");
const authRoutes = require("./routes/authRoutes");
const humeursUserRoute = require("./routes/humeursUser");

// Charger les variables d'environnement
dotenv.config();

// Vérifier que toutes les variables d'environnement nécessaires sont définies
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Erreur : la variable d'environnement ${key} n'est pas définie.`);
    process.exit(1);
  }
});

// Initialisation de l'application Express
const app = express();

// Configuration CORS (en production, autorise seulement certains domaines)
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? ["https://ton-domaine.com", "https://autre-domaine.com"]
    : "*",
};
app.use(cors(corsOptions));

// Logger les requêtes HTTP
app.use(morgan("dev"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB :", {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });

// Définition des routes
app.use("/api/auth", authRoutes);
app.use("/api", humeursUserRoute);
app.use("/api/humeurs", humeursRoutes);

// Middleware pour les routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée." });
});

// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur." });
});

// Afficher toutes les routes disponibles
console.log("Routes disponibles :");
console.log(listEndpoints(app));

// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

