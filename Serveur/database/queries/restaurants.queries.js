import { Restaurant } from "../models/restaurant.model.js";
import Comment from "../models/comment.model.js";

// Créer un nouveau restaurant
export const createRestaurantQuery = async restaurant => {
    return Restaurant.create(restaurant);
}

// Lire un restaurant par ID
export const getRestaurantQuery = async (id) => {
    return Restaurant.findById(id);
}

// Lire tous les restaurants
export const getAllRestaurantsQuery = async () => {
    return Restaurant.find({});
}

export const deleteRestaurantQuery = async id => {
    return Restaurant.findByIdAndDelete(id)
}

export const updateRestaurantQuery = async (id, restaurant) => {
    return Restaurant.findByIdAndUpdate(id, restaurant)
}


// Lire tous les commentaires d'un restaurant par ID
export const getCommentsByRestaurantIdQuery = async (restaurantId) => {
    return await Comment.find({ restaurant: restaurantId });
  };

