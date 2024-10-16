import * as queries from "../database/queries/restaurants.queries.js";
import Comment from "../database/models/comment.model.js"; 



export const createRestaurant = async (req, res) => {
  try {
    console.log('Début de createRestaurant');
    console.log('Headers reçus:', req.headers);
    console.log('Body reçu:', JSON.stringify(req.body, null, 2));
    console.log('Fichier reçu:', req.file);

    if (!req.body) {
      throw new Error('Aucune donnée reçue dans le corps de la requête');
    }

    // Vérification des champs requis
    const requiredFields = ['name', 'address', 'cuisineType', 'phoneNumber', 'schedule', 'description', 'priceFork', 'owner'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new Error(`Le champ ${field} est requis`);
      }
    }

    let scheduleObj;
    try {
      scheduleObj = typeof req.body.schedule === 'object' ? req.body.schedule : JSON.parse(req.body.schedule);
    } catch (error) {
      throw new Error('Le format de l\'horaire est invalide. Assurez-vous que c\'est un objet JSON valide.');
    }

    const restaurantData = {
      name: req.body.name,
      address: req.body.address,
      cuisineType: req.body.cuisineType,
      phoneNumber: req.body.phoneNumber,
      schedule: scheduleObj,
      description: req.body.description,
      priceFork: req.body.priceFork,
      owner: req.body.owner
    };

    // Ajouter RestoPhoto seulement s'il est présent
    if (req.file) {
      restaurantData.RestoPhoto = req.file.path;
    }

    console.log('Données du restaurant à créer:', JSON.stringify(restaurantData, null, 2));

    const restaurant = await queries.createRestaurantQuery(restaurantData);
    console.log('Restaurant créé:', JSON.stringify(restaurant, null, 2));
    
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Erreur détaillée lors de la création du restaurant:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Erreur lors de la création du restaurant',
      error: error.message,
      stack: error.stack,
      details: error.toString()
    });
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

