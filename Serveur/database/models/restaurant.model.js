import mongoose from "mongoose";
import { Owner } from "./owner.model.js";
import Comment from "./comment.model.js";
import axios from 'axios';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Name must have at least 3 letters"],
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Address must have at least 3 letters"],
  },
  cuisineType: {
    type: String,
    trim: true,
  },
  schedule: {
    type: String,
    trim: true,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  RestoPhoto: {
    type: String,
    trim: true,
    required: true,
  },
  globalRatingResaurant: {
    type: Number,
    default: 0,
  },
  latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    description: {
      type: String,
      trim: true,
      required: false, 
      minLength: [10, "Description must have at least 10 characters"], 
    },
});
// Méthode pour récupérer les coordonnées à partir de l'adresse
restaurantSchema.methods.fetchCoordinatesFromMapbox = async function () {
  const mapboxToken = 'pk.eyJ1IjoicGF0cmlja2M1MTQiLCJhIjoiY2x3aTlibWh3MDRxZTJscGszYnJoODI2ZSJ9.7abA_VeG2IHewqyfW7iAqw' // Assurez-vous que votre clé est dans .env
  const address = this.address; // Ou le champ que vous utilisez pour l'adresse
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`;

  try {
    const response = await axios.get(url);
    if (response.data.features.length > 0) {
      const coordinates = response.data.features[0].geometry.coordinates;
      this.longitude = coordinates[0];
      this.latitude = coordinates[1];
      await this.save(); // Sauvegarder les mises à jour
    } else {
      console.warn(`No coordinates found for address: ${address}`);
    }
  } catch (error) {
    console.error(`Error fetching coordinates for address: ${address}`, error.message);
  }
};



// Méthode pour calculer la note moyenne des commentaires associés à ce restaurant
restaurantSchema.methods.calculateGlobalRating = async function () {
  const restaurantId = this._id;

  // Utiliser l'aggregation pour calculer la moyenne des globalRating
  const result = await Comment.aggregate([
    { $match: { restaurant: restaurantId } },
    {
      $group: {
        _id: "$restaurant",
        averageRating: { $avg: "$globalRating" },
      },
    },
  ]);

  // Si des commentaires existent, mettre à jour la moyenne
  const newRating = result.length > 0 ? result[0].averageRating : 0;

  // Mettre à jour le champ globalRatingResaurant
  this.globalRatingResaurant = newRating;
  await this.save();
};

restaurantSchema.pre("save", async function (next) {
  try {
    const owner = await Owner.findById(this.owner);
    if (!owner) {
      throw new Error("Owner not found");
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export { Restaurant };
