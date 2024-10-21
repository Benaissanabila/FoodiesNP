import * as queries from "../database/queries/restaurants.queries.js";
import Comment from "../database/models/comment.model.js"; 
import {getOwnerByUser, createOwnerQuery} from "../database/queries/owners.queries.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Configurer le stockage de multer pour RestoPhoto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/'; // Dossier où les fichiers seront stockés
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Crée le dossier si nécessaire
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier avec un nom unique
  }
});

const upload = multer({ storage: storage });


// Fonction de création de restaurant
// Fonction de création de restaurant
export const createRestaurant = [
  upload.single('RestoPhoto'), // Middleware pour traiter le fichier
  async (req, res) => {
    try {
      console.log('Début de createRestaurant');
      console.log('Headers reçus:', req.headers);
      console.log('Body reçu:', JSON.stringify(req.body, null, 2));
      console.log('Fichier reçu:', req.file);

      if (!req.body) {
        return res.status(500).json({ message: 'Aucune donnée reçue dans le corps de la requête' });
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

      let owner = await getOwnerByUser(req.body.owner);
      if (!owner) {
        owner = await createOwnerQuery({ user: req.body.owner, restaurant: [] });
      }

      const restaurantData = {
        name: req.body.name,
        address: req.body.address,
        cuisineType: req.body.cuisineType,
        phoneNumber: req.body.phoneNumber,
        schedule: scheduleObj,
        description: req.body.description,
        priceFork: req.body.priceFork,
        owner: owner._id,
       RestoPhoto: req.file ? req.file.filename : null, 
      };

      console.log('Données du restaurant à créer:', JSON.stringify(restaurantData, null, 2));

      const restaurant = await queries.createRestaurantQuery(restaurantData);
      console.log('Restaurant créé:', JSON.stringify(restaurant, null, 2));
      
      // Récupérer les coordonnées après la création
      await restaurant.fetchCoordinatesFromMapbox();
      
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
  }
];


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


export async function getRestaurantsByOwner(req, res) {
  const ownerId = req.params.ownerId;
  console.log('Recherche des restaurants pour le propriétaire:', ownerId);

  try {
      const restaurants = await queries.getRestaurantsByOwnerIdQuery(ownerId);
      if (restaurants.length === 0) {
          console.log('Aucun restaurant trouvé pour le propriétaire:', ownerId);
          return res.status(404).json({ message: 'Aucun restaurant trouvé pour cet owner.' });
      }
      console.log(`${restaurants.length} restaurants trouvés pour le propriétaire:`, ownerId);
      res.status(200).json(restaurants);
  } catch (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des restaurants.', error: error.message });
  }
}

