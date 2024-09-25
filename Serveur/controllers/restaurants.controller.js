import * as queries from "../database/queries/restaurants.queries.js";
import Comment from "../database/models/comment.model.js"; // Ajoute cette ligne
 
export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await queries.createRestaurantQuery(req.body);
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await queries.getRestaurantQuery(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status500().json({ error: error.message });
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
      return res.status(404).json({ message: "Restaurant not found" });
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
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Fonction pour mettre à jour la note globale d'un restaurant
export const updateGlobalRating = async (req, res) => {
  const { id } = req.params;

  try {
      // Récupérez tous les commentaires associés au restaurant
      const comments = await Comment.find({ restaurant: id });

      // Si aucun commentaire n'existe, renvoyez une note globale de 0
      if (comments.length === 0) {
          await Restaurant.findByIdAndUpdate(id, { globalRating: 0 });
          return res.status(200).json({ message: 'Aucun commentaire trouvé, note globale mise à jour à 0.' });
      }

      // Calculez la note globale
      const globalRating = comments.reduce((sum, comment) => sum + comment.globalRating, 0) / comments.length;

      // Mettez à jour le restaurant avec la nouvelle note
      await Restaurant.findByIdAndUpdate(id, { globalRating });
      res.status(200).json({ message: 'Note globale mise à jour avec succès', globalRating });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la note globale' });
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


