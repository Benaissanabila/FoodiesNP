import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import * as db from "./database/index.js";
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();

// Configuration CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de multer pour gérer les fichiers uploadés
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Assurez-vous que ce dossier existe
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

import restaurantRoutes from './router/restaurants.routes.js';
app.use('/restaurants', restaurantRoutes);

// Middleware pour parser le JSON et les données de formulaire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importe et utilise le router
import router from "./router/index.js";
app.use("/", router);

// Sert les fichiers statiques du dossier 'uploads'
app.use('/uploads', express.static('uploads'));

// Middleware de gestion des erreurs
// Dans votre fichier app.js ou index.js
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).json({
    error: 'Une erreur interne du serveur s\'est produite',
    details: err.message,
    stack: err.stack
  });
});

app.use((req, res, next) => {
  console.log('Requête reçue:', {
    method: req.method,
    url: req.url,
    body: req.body,
    files: req.files
  });
  next();
});

// Connexion à la base de données et démarrage du serveur
db.connect(() => {
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`Serveur démarré sur port ${process.env.SERVER_PORT}`);
  });
});