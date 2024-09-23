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

// création de l'application serveur elle même
const app = express();

// permet au serveur de comprendre les requêtes en JSON
app.use(express.json());
// permet au serveur de comprendre les requêtes en x-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// importe le router pour les veggies
import router from "./router/index.js";
// ajoute le router à l'application
app.use("/", router);

// on se connecte à la database et ensuite (si réussi) on démarre le serveur


