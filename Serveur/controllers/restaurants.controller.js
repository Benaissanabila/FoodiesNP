import * as queries from "../database/queries/restaurants.queries.js";
import Comment from "../database/models/comment.model.js"; 




export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await queries.createRestaurantQuery(req.body);
    
    // Appeler la méthode pour récupérer les coordonnées
    await restaurant.fetchCoordinatesFromMapbox();
    
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await queries.getRestaurantQuery(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await queries.getAllRestaurantsQuery();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await queries.updateRestaurantQuery(
      req.params.id,
      req.body
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await queries.deleteRestaurantQuery(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }
    res.status(200).json({ message: "Restaurant supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fonction pour obtenir les commentaires d'un restaurant par ID
export const getCommentsByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params; 
  try {
    const comments = await Comment.find({ restaurant: restaurantId }); 
    if (comments.length === 0) {
      return res.status(404).json({ message: 'Aucun commentaire trouvé pour ce restaurant.' });
    }
    res.json(comments);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Erreur interne du serveur.' }); 
  }
};

