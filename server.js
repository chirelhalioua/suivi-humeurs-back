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

// Vérification des variables d'environnement
if (!process.env.MONGODB_URI) {
  console.error("Erreur : la variable d'environnement MONGO_URI n'est pas définie.");
  process.exit(1); // Arrête le serveur si MONGO_URI n'est pas défini
}

// Initialisation de l'application Express
const app = express();

// Configuration dynamique de CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://les-humeurs-a-la-funes.vercel.app/"] 
      : "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes HTTP autorisées
  allowedHeaders: ["Content-Type", "Authorization"], // Headers autorisés
};

app.use(cors(corsOptions)); // Appliquer les options CORS

// Middleware pour analyser les requêtes
app.use(express.json()); // Analyse les requêtes avec un payload JSON
app.use(express.urlencoded({ extended: true })); // Analyse les requêtes URL-encoded

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

// Routes principales
app.use("/api/auth", authRoutes);
app.use("/api", humeursUserRoute);
app.use("/api/humeurs", humeursRoutes);

// Liste des routes disponibles
console.log("Routes disponibles :");
console.table(listEndpoints(app)); // Affichage des routes sous forme de table pour plus de lisibilité

// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error("Erreur détectée :", err.stack);
  res.status(500).json({ message: "Erreur interne du serveur." });
});

// Démarrage du serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
