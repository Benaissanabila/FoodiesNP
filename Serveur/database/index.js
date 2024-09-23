import mongoose from "mongoose";

const protocol = "mongodb+srv";
const url = "patcomeau.vah32vy.mongodb.net"; // votre cluster
const params = "?retryWrites=true&w=majority";
const username = "User"; // le username de votre serveur mongodb
const password = "pw4User$"; // le mot de passe de votre serveur mongodb
const database = "projet-Foodies"; // le nom de la base de données

// la string de connection pour vous connecter (et vous connecter)
// à l'outil mongodb de vscode/**

export const connectionString = `${protocol}://${username}:${password}@${url}/${database}${params}`;
 
/** Se connecte à une base de données MongoDB en utilisant la chaîne de connexion à l'intérieur de la fonction connect de mongoose.
 *
 * @param {function} callback - Fonction facultative à exécuter après une connexion réussie.
 * @return {Promise} Une promesse qui se résout avec l'instance de la base de données connectée.
 */
export const connect = (callback) =>
  mongoose
    .connect(connectionString)
    .then((db) => {
      console.log(`Connecté avec succès à la base ${database} sur ${url}`);
      if (callback) callback();
    })
    .catch((err) => {
      console.log(err);
    });
