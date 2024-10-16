import express from 'express';
const router = express.Router();

import * as controller from "../controllers/restaurants.controller.js"

import multer from 'multer';


const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // Limite à 10MB
  });

// Créer un nouveau restaurant
router.post('/', controller.createRestaurant);

// Lire tous les restaurants
router.get('/', controller.getAllRestaurants);

// Lire un restaurant par ID
router.get('/:id', controller.getRestaurant);

// Mettre à jour un restaurant par ID
router.put('/:id', controller.updateRestaurant);

// Supprimer un restaurant par ID
router.delete('/:id', controller.deleteRestaurant);

// Obtenir tous les commentaires d'un restaurant par ID
router.get('/:restaurantId/comments', controller.getCommentsByRestaurantId);

router.post('/', upload.single('RestoPhoto'), (req, res, next) => {
    console.log('Fichier reçu:', req.file);
    console.log('Body reçu:', req.body);
    next();
  }, controller.createRestaurant);

  



export default router;