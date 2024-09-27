import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import * as db from "../index.js";
import fs from "fs";

import User from "../models/user.model.js";
import { Owner } from "../models/owner.model.js";
import Comment from "../models/comment.model.js";
import Reservation from "../models/reservation.model.js";
import Plan from "../models/plan.model.js";
import { Restaurant } from "../models/restaurant.model.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", runSeed);

db.connect(() => {
  app.listen(process.env.SEED_PORT, () =>
    console.log("Serveur démarré sur port :", process.env.SEED_PORT)
  );
});

async function runSeed(req, res, next) {
  console.log("seed started");

  await User.deleteMany({});
  await Comment.deleteMany({});
  await Restaurant.deleteMany({});
  await Reservation.deleteMany({});
  await Owner.deleteMany({});
  await Plan.deleteMany({});

  try {
    // Insérer les plans
    const plansData = fs.readFileSync("./database/data/plans.json", "utf-8");
    const plans = JSON.parse(plansData);
    console.log(plans);
    await Plan.insertMany(plans);
    console.log("plans inserted");

    //---------------------------------------------------------------------
    // Insérer les users
    const usersData = fs.readFileSync("./database/data/users.json", "utf-8");
    const users = JSON.parse(usersData);
    const dbUsers = await User.insertMany(users);
    console.log("Users inserted");

    //---------------------------------------------------------------------
    // Création des owners
    const owners = [];
    for (let i = 0; i < dbUsers.length; i++) {
      console.log(`Creating owner for user: ${dbUsers[i].name}`);

      // Sélectionner aléatoirement un plan
      const randomPlan = await Plan.aggregate([
        { $sample: { size: 1 } },
        { $project: { _id: 1 } }
      ]);

      // Créer un nouveau owner
      const newOwner = new Owner({
        user: dbUsers[i]._id,
        plan: randomPlan[0]._id
      });

      // Sauvegarder le nouveau owner
      await newOwner.save();
      owners.push(newOwner);
    }
    console.log("Owners inserted");

    //---------------------------------------------------------------------
    // Insérer les restaurants
    // ... Votre code de seed existant ...

// Insérer les restaurants
const restaurantsData = fs.readFileSync("./database/data/restaurants.json", "utf-8");
const restaurants = JSON.parse(restaurantsData);

const dbRestaurants = []; // Initialiser un tableau pour stocker les restaurants

for (let i = 0; i < restaurants.length; i++) {
  const restaurant = restaurants[i];
  const randomOwner = owners[Math.floor(Math.random() * owners.length)];
  const newRestaurant = new Restaurant({
    ...restaurant,
    owner: randomOwner._id
  });

  await newRestaurant.save(); // Enregistrer d'abord le restaurant

  // Récupérer les coordonnées après l'enregistrement
  await newRestaurant.fetchCoordinatesFromMapbox(); // Cela met à jour l'altitude et la longitude

  console.log(`Restaurant inserted: ${restaurant.name}`);

  dbRestaurants.push(newRestaurant); // Ajouter le restaurant au tableau
}

// Assurez-vous de ne pas utiliser dbRestaurants avant cette boucle

console.log("All restaurants inserted");

// Continuez avec la génération et l'insertion des réservations et des commentaires...


    //---------------------------------------------------------------------
    // Générer et insérer les réservations
    const reservationsData = JSON.parse(fs.readFileSync("./database/data/reservations.json", "utf-8"));
    const dbReservations = [];

    for (const restaurant of dbRestaurants) {

      // Générer un nombre aléatoire de réservations pour chaque restaurant (entre 1 et 5)
      const numberOfReservations = Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < numberOfReservations; i++) {
        const randomReservation = reservationsData[Math.floor(Math.random() * reservationsData.length)];

        const newReservation = new Reservation({
          tableId: randomReservation.tableId,
          numberOfPersons: randomReservation.numberOfPersons,
          reservationDate: new Date(randomReservation.reservationDate),
          status: randomReservation.status,
          restaurant: restaurant._id
        });

        await newReservation.save();
        dbReservations.push(newReservation);

        console.log(`Reservation created for restaurant "${restaurant.name}"`);
      }
    }
   
    console.log("Reservations inserted");

    

//---------------------------------------------------------------------
// Générer et insérer les commentaires
const commentsData = JSON.parse(fs.readFileSync("./database/data/comments.json", "utf-8"));
const dbComments = [];

for (const restaurant of dbRestaurants) {
  // Récupérer les réservations pour ce restaurant
  const restaurantReservations = dbReservations.filter(res => res.restaurant.toString() === restaurant._id.toString());

  // Si le restaurant n'a pas de réservations, passer au suivant
  if (restaurantReservations.length === 0) {
    console.log(`Skipping comments for restaurant "${restaurant.name}" as it has no reservations`);
    continue;
  }

  // Générer un nombre aléatoire de commentaires pour chaque restaurant (entre 1 et le nombre de réservations)
  const numberOfComments = Math.min(Math.floor(Math.random() * 5) + 1, restaurantReservations.length);

  for (let i = 0; i < numberOfComments; i++) {
    const randomComment = commentsData[Math.floor(Math.random() * commentsData.length)];
    const randomUser = dbUsers[Math.floor(Math.random() * dbUsers.length)];
    const randomReservation = restaurantReservations[Math.floor(Math.random() * restaurantReservations.length)];

    const newComment = new Comment({
      quality: randomComment.quality,
      globalRating: randomComment.globalRating,
      service: randomComment.service,
      ambiance: randomComment.ambiance,
      upvotes: randomComment.upvotes,
      downvotes: randomComment.downvotes,
      comment: randomComment.comment,
      createdAt: new Date(randomComment.createdAt),
      user: randomUser._id,
      restaurant: restaurant._id,
      reservation: randomReservation._id
    });

    try {
      await newComment.save();
      dbComments.push(newComment);
      console.log(`Comment created for restaurant "${restaurant.name}"`);
    } catch (error) {
      console.error(`Failed to create comment for restaurant "${restaurant.name}":`, error.message);
    }
  }
}

console.log("Comments inserted");

    res.json({ message: "Seed completed successfully" });
  } catch (error) {
    console.log("Seed failed");
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}
