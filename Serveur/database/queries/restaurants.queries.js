import { Restaurant } from "../models/restaurant.model.js";
import Comment from "../models/comment.model.js";
import {Owner} from "../models/owner.model.js";

// Créer un nouveau restaurant
export const createRestaurantQuery = async (restaurantData) => {
  try {
    console.log('Création du restaurant avec les données:', JSON.stringify(restaurantData, null, 2));
    const restaurant = new Restaurant(restaurantData);
    console.log('Modèle de restaurant créé:', JSON.stringify(restaurant, null, 2));
    const savedRestaurant = await restaurant.save();
    console.log('Restaurant sauvegardé:', JSON.stringify(savedRestaurant, null, 2));

    // Mise à jour du propriétaire
    const owner = await Owner.findById(restaurantData.owner);
    if (owner) {
      owner.restaurant.push(savedRestaurant._id);
      await owner.save();
      console.log('Propriétaire mis à jour avec le nouveau restaurant');
    } else {
      console.log('Propriétaire non trouvé');
    }

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
export const updateRestaurantQuery = async (id, restaurantData) => {
    try {
        console.log('Mise à jour du restaurant:', id);
        console.log('Données de mise à jour:', restaurantData);
        
        const restaurant = await Restaurant.findByIdAndUpdate(
            id,
            restaurantData,
            { 
                new: true,        // Retourne le document mis à jour
                runValidators: true  // Lance la validation du schéma
            }
        );
        
        if (!restaurant) {
            throw new Error('Restaurant non trouvé');
        }
        
        return restaurant;
    } catch (error) {
        console.error('Erreur dans updateRestaurantQuery:', error);
        throw error;
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

export const getRestaurantsByOwnerIdQuery = async (ownerId) => {
    try {
        console.log('Exécution de la requête pour trouver les restaurants du propriétaire:', ownerId);
        const restaurants = await Restaurant.find({ owner: ownerId });
        console.log(`${restaurants.length} restaurants trouvés pour le propriétaire:`, ownerId);
        return restaurants;
    } catch (error) {
        console.error(`Erreur lors de la sélection des restaurants pour le propriétaire ${ownerId}:`, error);
        throw new Error(`Erreur lors de la sélection des restaurants : ${error.message}`);
    }
}