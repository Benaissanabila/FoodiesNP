import express from 'express';
const router = express.Router();

import * as controller from "../controllers/restaurants.controller.js"

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ 
    storage: storage,
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

router.post('/', upload.single('RestoPhoto'), controller.createRestaurant);



export default router;