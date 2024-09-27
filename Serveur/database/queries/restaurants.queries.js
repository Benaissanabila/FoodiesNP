import { Restaurant } from "../models/restaurant.model.js";
import Comment from "../models/comment.model.js";

// Créer un nouveau restaurant
export const createRestaurantQuery = async (restaurant) => {
    try {
        return await Restaurant.create(restaurant);
    } catch (error) {
        throw new Error(`Erreur lors de la création du restaurant : ${error.message}`);
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



