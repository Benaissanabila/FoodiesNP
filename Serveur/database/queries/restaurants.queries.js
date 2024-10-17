import { Restaurant } from "../models/restaurant.model.js";
import Comment from "../models/comment.model.js";

// Créer un nouveau restaurant
export const createRestaurantQuery = async (restaurantData) => {
    try {
      console.log('Création du restaurant avec les données:', JSON.stringify(restaurantData, null, 2));
      const restaurant = new Restaurant(restaurantData);
      console.log('Modèle de restaurant créé:', JSON.stringify(restaurant, null, 2));
      const savedRestaurant = await restaurant.save();
      console.log('Restaurant sauvegardé:', JSON.stringify(savedRestaurant, null, 2));
      return savedRestaurant;
    } catch (error) {
      console.error('Erreur lors de la création du restaurant dans la base de données:', error);
      console.error('Validation errors:', error.errors);
      throw error;
    }
  };

// Lire un restaurant par ID
export const getRestaurantQuery = async (id) => {
    try {
        return await Restaurant.findById(id);
    } catch (error) {
        throw new Error(`Erreur lors de la récupération du restaurant : ${error.message}`);
    }
};

// Lire tous les restaurants
export const getAllRestaurantsQuery = async () => {
    try {
        return await Restaurant.find({});
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des restaurants : ${error.message}`);
    }
};

// Supprimer un restaurant par ID
export const deleteRestaurantQuery = async (id) => {
    try {
        return await Restaurant.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(`Erreur lors de la suppression du restaurant : ${error.message}`);
    }
};

// Mettre à jour un restaurant par ID
export const updateRestaurantQuery = async (id, restaurant) => {
    try {
        return await Restaurant.findByIdAndUpdate(id, restaurant, { new: true }); // L'option { new: true } retourne le document mis à jour
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour du restaurant : ${error.message}`);
    }
};

// Lire tous les commentaires d'un restaurant par ID
export const getCommentsByRestaurantIdQuery = async (restaurantId) => {
    try {
        return await Comment.find({ restaurant: restaurantId });
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des commentaires : ${error.message}`);
    }
};