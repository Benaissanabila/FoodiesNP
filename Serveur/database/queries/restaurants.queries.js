import { Restaurant } from "../models/restaurant.model.js";


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