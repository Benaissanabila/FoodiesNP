//console.log("Hello world !");
// importe les variables d'environnement
import dotenv from "dotenv";
dotenv.config();
// importe le connecteur mongoose
import mongoose from "mongoose";
// importe express qui permet de créer un serveur
import express from "express";
// importe tous les "exports" du fichier index.js 
// inclut la fonction connect et la constante connectionString
import * as db from "./database/index.js";
import cors from 'cors'; 

// création de l'application serveur elle même
const app = express();
app.use(cors());
// permet au serveur de comprendre les requêtes en JSON
app.use(express.json());
// permet au serveur de comprendre les requêtes en x-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// importe le router pour les veggies
import router from "./router/index.js";
// ajoute le router à l'application
app.use("/", router);
app.use('/uploads', express.static('uploads'));

// on se connecte à la database et ensuite (si réussi) on démarre le serveur
db.connect(() => {
    // met le serveur en mode écoute sur le port 3000.  (http://localhost:3000)
    app.listen(process.env.SERVER_PORT, () => console.log("Serveur demarré sur port 3000"));
  });
  

